import supertest from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})


describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await supertest(app).post('/api/auth/register').send({
      email: 'test@test.com',
      name: 'test',
      password: 'test123456'
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')
  })
  it('should login a user', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'test123456'
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User Logined')
  })
  it('should logout a user', async () => {
    const response = await supertest(app).post('/api/auth/logout').send({
      email: 'test@test.com',
      password: 'test123456'
    })
  })
  it('should get error if user already exists', async () => {
    const response = await supertest(app).post('/api/auth/register').send({
      email: 'test@test.com',
      name: 'test',
      password: 'test123456'
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('User already exists')
  })
})