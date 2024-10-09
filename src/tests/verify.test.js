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

describe('POST /verify/email', () => {
  it('Should verify the email successfully', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      emailVerificationCode: '123456',
      emailVerificationCodeExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/verify/email').send({
      email: 'john.doe@example.com',
      verificationCode: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Verified Successfully.');
  });

  it('Should not verify the email if the code is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      emailVerificationCode: '123456',
      emailVerificationCodeExpiresAt: Date.now() + 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/verify/email').send({
      email: 'john.doe@example.com',
      verificationCode: '000000',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired verification code.'
    );
  });

  it('Should not verify the email if the code is expired', async () => {
    await User.create({
      name: 'John Doe',
      password: 'SecurePassword123',
      isVerified: false,
      email: 'john.doe@example.com',
      emailVerificationCode: '123456',
      emailVerificationCodeExpiresAt: Date.now() - 24 * 50 * 60 * 1000,
    });

    const res = await request(app).post('/verify/email').send({
      email: 'john.doe@example.com',
      verificationCode: '123456',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty(
      'message',
      'Invalid or expired verification code.'
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
