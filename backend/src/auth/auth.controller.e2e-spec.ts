import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { getConnection } from 'typeorm'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    await getConnection().synchronize(true)
  })

  afterEach(async () => {
    await getConnection().close()
  })

  describe('AuthController signup', () => {
    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '123$%Peaa',
        })
        .expect(201)
    })

    it('/auth/signup (POST) user exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '123$%Peaa',
        })
        .expect(201)
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '123$%Peaa',
        })
        .expect(409)
        .expect({
          statusCode: 409,
          message: 'Username already exists',
          error: 'Conflict',
        })
    })

    it('/auth/signup (POST) weak password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '12344568',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['password too weak'],
          error: 'Bad Request',
        })
    })

    it('/auth/signup (POST) short password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '123$%Pe',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        })
    })
  })

  describe('AuthController signin', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'pepe',
          password: '123$%Peaa',
        })
    })

    it('/auth/signin (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: 'pepe',
          password: '123$%Peaa',
        })
        .expect(201)
    })

    it('/auth/signin (POST) wrong credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: 'pepe loco',
          password: '123$%Peaa',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        })

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: 'pepe',
          password: '123$%Peeeaa',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        })
    })
  })
})
