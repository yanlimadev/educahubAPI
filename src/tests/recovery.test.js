const request = require('supertest');

const app = require('../app.js');
const { connect, close } = require('../database/connectMock.js');
const User = require('../models/user.model.js');

require('dotenv/config');

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

describe('POST /recovery/password', () => {
  it('Should verify the email successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      verificationToken: '123456',
      verificationTokenExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/recovery/password').send({
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty(
      'message',
      'The recovery password email is sent.'
    );
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

    const res = await request(app).post('/recovery/password').send({
      email: 'john@example.com',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found.');
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});

describe('POST /recovery/password/{recoveryPasswordCode}', () => {
  it('Should reset the password successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: true,
      email: 'john.doe@example.com',
      recoveryPasswordCode: '123456',
      recoveryPasswordCodeExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/recovery/password/123456').send({
      email: 'john.doe@example.com',
      newPassword: 'newSecurePassword',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Password reset successfully.');
  });

  it('Should not reset the password if the code is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: true,
      email: 'john.doe@example.com',
      recoveryPasswordCode: '123456',
      recoveryPasswordCodeExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/recovery/password/10001').send({
      email: 'john.doe@example.com',
      newPassword: 'newSecurePassword',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired recovery code.'
    );
  });

  it('Should not reset the password if the code is expired', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      recoveryPasswordCode: '123456',
      recoveryPasswordCodeExpiresAt: Date.now() - 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/recovery/password/123456').send({
      email: 'john.doe@example.com',
      newPassword: 'newSecurePassword',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired recovery code.'
    );
  });

  it('Should return http bad request status if any field is empty', async () => {
    const res = await request(app).post('/recovery/password/123456').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Required fields are missing.');
  });
});
