import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConfigModule } from './config/mongo.config';
import { AuthModule } from './auth/Auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service'; // <-- Add this import
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DealModule } from './deal/deal.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoConfigModule,
    TasksModule,
    DealModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply() // Add any middleware here if needed
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
