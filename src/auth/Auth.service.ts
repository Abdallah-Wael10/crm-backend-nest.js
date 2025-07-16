import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/users.schema';
import { MailService } from '../mail/mail.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordReset } from './password-reset.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordReset>, // أضف هذا السطر
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ username: dto.username });
    if (exists) throw new ConflictException('Username already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hash,
      role: dto.role || Role.User,
    });
    return {
      message: 'User registered',
      user: { username: user.username, email: user.email, role: user.role },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    await this.mailService.sendLoginMail(user.email, user.username);

    return {
      access_token: token,
      user: { username: user.username, email: user.email, role: user.role },
    };
  }

  // Forget password
  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) return { message: 'If this email exists, a code will be sent.' };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    await this.passwordResetModel.create({ email: dto.email, code, expiresAt });

    await this.mailService.sendResetPasswordMail(dto.email, code);

    return { message: 'If this email exists, a code will be sent.' };
  }

  // Reset password
  async resetPassword(dto: ResetPasswordDto) {
    const reset = await this.passwordResetModel.findOne({
      email: dto.email,
      code: dto.code,
      expiresAt: { $gt: new Date() },
    });
    if (!reset) throw new UnauthorizedException('Invalid or expired code');

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.userModel.updateOne({ email: dto.email }, { password: hash });
    await this.passwordResetModel.deleteOne({
      email: dto.email,
      code: dto.code,
    });

    return { message: 'Password reset successfully' };
  }
}
