const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../app.js');
const { connect, close } = require('../database/connectMock.js');
const User = require('../models/user.model.js');

require('dotenv').config();

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
      password: await bcrypt.hash('SecurePassword123', 10),
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john.doe@example.com',
      password: 'SecurePassword123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Logged successfully.');
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

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found.');
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
    expect(res.body).toHaveProperty('message', 'Logout successfully.');
  });
});

describe('GET /auth/check-auth', () => {
  it('Should return success and the user info if the user is logged in', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcrypt.hash('SecurePassword123', 10),
      email: 'john.doe@example.com',
    });

    const user = await User.findOne({ name: 'John Doe' });
    const userId = user._id;

    const JWT_KEY = process.env.JWT_SECRET;
    const token = await jwt.sign({ userId }, JWT_KEY, {
      expiresIn: '1d',
    });

    const res = await request(app)
      .get('/auth/check-auth')
      .set('Cookie', [`authToken=${token}`]);

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
      'The authentication token is invalid or missing.'
    );
  });

  it('Should return error if the authentication cookie is invalid', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcrypt.hash('SecurePassword123', 10),
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
      'The authentication token is invalid or missing.'
    );
  });

  it('Should return error if the cookie has a jwt to an invalid userId', async () => {
    await User.create({
      name: 'John Doe',
      password: await bcrypt.hash('SecurePassword123', 10),
      email: 'john.doe@example.com',
    });

    const user = await User.findOne({ name: 'John Doe' });
    const userId = user._id;

    const JWT_KEY = process.env.JWT_SECRET;
    const token = await jwt.sign({ userId }, JWT_KEY, {
      expiresIn: '1d',
    });
    await User.deleteMany({});

    const res = await request(app)
      .get('/auth/check-auth')
      .set('Cookie', [`authToken=${token}`]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found.');
  });
});
