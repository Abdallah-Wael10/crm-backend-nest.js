# CRM Backend API

Backend RESTful API for a CRM system built with **NestJS** and **MongoDB**.

---

## Features

- **Authentication & Authorization** (JWT, roles: user/admin)
- **User Management** (register, login, CRUD, roles)
- **Customer Management** (CRUD, each customer linked to a user)
- **Deals Management** (CRUD, each deal linked to user & customer, email notification on create/update)
- **Tasks Management** (CRUD, assign to self or by admin to any user, email notification)
- **Password Reset** (email code, secure reset)
- **Rate Limiting** (Throttler)
- **Validation** (class-validator)
- **Email Notifications** (Nodemailer + EJS templates)
- **Secure** (Helmet, CORS, JWT)

---

## Tech Stack

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Nodemailer](https://nodemailer.com/)
- [EJS](https://ejs.co/) (for email templates)
- [JWT](https://jwt.io/)
- [class-validator](https://github.com/typestack/class-validator)

---

## Getting Started

### 1. **Clone the repo**

```bash
git clone https://github.com/your-username/crm-backend.git
cd crm-backend
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Edit `.env` file:

```
MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5000
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=1d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** Use a Gmail App Password for `EMAIL_PASS` if using Gmail.

---

### 4. **Run the app**

```bash
npm run start:dev
```

App will run on [http://localhost:5000](http://localhost:5000)

---

## API Structure

### **Auth**

- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, returns JWT
- `POST /auth/forget-password` — Send reset code to email
- `POST /auth/reset-password` — Reset password with code

### **Users**

- `GET /users` — List all users (admin only)
- `GET /users/:id` — Get user by ID
- `POST /users` — Create user (admin only)
- `PUT /users/:id` — Update user
- `DELETE /users/:id` — Delete user

### **Customers**

- `GET /api/customers` — List all customers
- `GET /api/customers/:id` — Get customer by ID
- `POST /api/customers` — Create customer (userId auto from JWT)
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

### **Deals**

- `GET /api/deals` — List all deals
- `GET /api/deals/:id` — Get deal by ID
- `POST /api/deals` — Create deal (userId auto from JWT, customerId required)
- `PUT /api/deals/:id` — Update deal
- `DELETE /api/deals/:id` — Delete deal

> **Email notification sent to user on create/update deal**

### **Tasks**

- `GET /api/tasks` — List tasks (user: own, admin: all)
- `GET /api/tasks/:id` — Get task by ID
- `POST /api/tasks` — Create task for self (assignedTo auto from JWT)
- `POST /api/tasks/assign` — Admin assigns task to any user (assignedTo required)
- `PUT /api/tasks/:id` — Update task (only assigned user or admin)
- `DELETE /api/tasks/:id` — Delete task (only assigned user or admin)

> **Email notification sent to assigned user on create**

---

## Testing with Postman

1. **Register/Login** to get JWT token.
2. **Set Header**:  
   `Authorization: Bearer <your_token>`
3. **Try endpoints** as described above.

---

## Email Templates

- Located in `src/mail/templates/`
- Uses EJS for dynamic content (task, deal, login, reset-password)

---

## Project Structure

```
src/
  auth/
  users/
  customers/
  deal/
  tasks/
  mail/
  common/
  config/
  main.ts
.env
```

---

## Scripts

- `npm run start:dev` — Start in dev mode
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run e2e tests

---

## License

MIT

---

**Developed with ❤️ using NestJS**
