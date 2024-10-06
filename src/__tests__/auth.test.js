const supertest = require('supertest');
const app = require('../app');

const user = {
  displayName: 'jon doe',
  email: 'jon.doe@example.com',
  password: '!jon123',
};

describe('POST /signup', () => {
  it('should signup user', async () => {
    const response = await supertest(app)
      .post('/api/v1/auth/signup')
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.displayName).toBe('jon doe');
    expect(response.body.email).toBe('jon.doe@example.com');
    expect(response.body.password).toBeUndefined();
  });

  it('should return error if user already exists', async () => {
    await supertest(app).post('/api/v1/auth/signup').send(user);
    const response = await supertest(app)
      .post('/api/v1/auth/signup')
      .send(user);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('User already exists');
  });

  it('should return an error if required fields are missing', async () => {
    const response = await supertest(app).post('/api/v1/auth/signup').send({
      email: 'jon.doe@example.com',
      password: '!jon123',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Parameters missing');
  });
});

describe('POST /login', () => {
  it('should log in user', async () => {
    await supertest(app).post('/api/v1/auth/signup').send(user); // signup first
    const response = await supertest(app).post('/api/v1/auth/login').send({
      email: 'jon.doe@example.com',
      password: '!jon123',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return an error if required fields are missing', async () => {
    await supertest(app).post('/api/v1/auth/signup').send(user);
    const response = await supertest(app).post('/api/v1/auth/login').send({
      email: 'jon.doe@example.com',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Parameters missing');
  });

  it('should return an error for invalid credentials', async () => {
    const response = await supertest(app).post('/api/v1/auth/login').send({
      email: 'jon.hamm@example.com',
      password: '321noj!',
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
