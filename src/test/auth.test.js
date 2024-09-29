import request from 'supertest';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import app from '../server.js';
import { connect, close } from '../mock/mockConnect.js';
import { User } from '../models/user.model.js';

import dotenv from 'dotenv';
dotenv.config();

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await connect();
});
afterAll(async () => {
  await close();
});
afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /auth/signup', () => {
  it('Should create a new user', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
  });

  it('Should not allow the creation of a user with the same email', async () => {
    await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password',
    });

    const res = await request(app).post('/auth/signup').send({
      name: 'Jane Doe',
      email: 'john.doe@example.com',
      password: 'password456',
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User already exists.');
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('POST /auth/login', () => {
  it('Should authenticate an already registered user', async () => {
    await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await bcryptjs.hash('SecurePassword123', 10),
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: 'SecurePassword123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Login successful.');
    expect(res.body).toHaveProperty('user');
  });

  it('Should not allow login with a wrong password', async () => {
    await request(app).post('/auth/signup').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });

  it('Should return bad request http status if there is no user with the email sent in the request', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: 'SecurePassword123',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('POST /auth/logout', () => {
  it('Should remove the authentication cookie', async () => {
    const res = await request(app).post('/auth/logout').send({});

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Logged out successfully.');
  });
});

describe('POST /auth/verify-email', () => {
  it('Should verify the email successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/verify-email').send({
      email: 'john.doe@example.com',
      verificationCode: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Email verified successfully.');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('isVerified', true);
  });

  it('Should not verify the email if the code is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/verify-email').send({
      email: 'john.doe@example.com',
      verificationCode: '000000',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid credentials or expired verification code.',
    );
  });

  it('Should not verify the email if the code is expired', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() - 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/verify-email').send({
      email: 'john.doe@example.com',
      verificationCode: '123456',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid credentials or expired verification code.',
    );
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('POST /auth/forgot-password', () => {
  it('Should verify the email successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/forgot-password').send({
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Password reset Link sent.');
  });

  it('Should not send the email if the user have an unknown email', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/forgot-password').send({
      email: 'john@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('POST /auth/reset-password/{resetPasswordToken}', () => {
  it('Should reset the password successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: true,
      email: 'john.doe@example.com',
      resetPasswordToken: '123456',
      resetPasswordTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/reset-password/123456').send({
      password: 'newSecurePassword',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty(
      'message',
      'Password has been reset successfully.',
    );
  });

  it('Should not reset the password if the code is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: true,
      email: 'john.doe@example.com',
      resetPasswordToken: '123456',
      resetPasswordTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/reset-password/10001').send({
      password: 'newSecurePassword',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired reset token.',
    );
  });

  it('Should not reset the password if the code is expired', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      resetPasswordToken: '123456',
      resetPasswordTokenExpiresAt: Date.now() - 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/auth/reset-password/123456').send({
      password: 'newSecurePassword',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired reset token.',
    );
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/reset-password/123456').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('GET /auth/check-auth', () => {
  it('Should return success and the user info if the user is logged in', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcryptjs.hash('SecurePassword123', 10),
      email: 'john.doe@example.com',
    });

    const user = await User.findOne({ name: 'John Doe' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const res = await request(app)
      .get('/auth/check-auth')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
  });

  it('Should return error if the user is not logged in', async () => {
    const res = await request(app).get('/auth/check-auth');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized - Token is missing',
    );
  });

  it('Should return error if the authentication cookie is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcryptjs.hash('SecurePassword123', 10),
      email: 'john.doe@example.com',
    });

    const user = await User.findOne({ name: 'John Doe' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET + '_', {
      expiresIn: '7d',
    });

    const res = await request(app)
      .get('/auth/check-auth')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized - Token is invalid',
    );
  });

  it('Should return error if the cookie has a jwt to an invalid userId', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcryptjs.hash('SecurePassword123', 10),
      email: 'john.doe@example.com',
    });

    const user = await User.findOne({ name: 'John Doe' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    await User.deleteMany({});

    const res = await request(app)
      .get('/auth/check-auth')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
