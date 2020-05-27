import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { getConnection } from 'typeorm'

async function getAccessToken(app: INestApplication): Promise<string> {
  let accessToken: string
  await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      username: 'user-contact',
      password: '123$%Peaa',
    })
  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({
      username: 'user-contact',
      password: '123$%Peaa',
    })
    .expect(function(res) {
      accessToken = res.body.accessToken
    })

  return accessToken
}

describe('Contactscontroller (e2e)', () => {
  let app: INestApplication
  let accessToken: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    await getConnection().synchronize(true)

    accessToken = await getAccessToken(app)
  })

  afterEach(async () => {
    await getConnection().close()
  })

  describe('ContactsController create contact', () => {
    it('/contacts (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'example@of.email',
          phoneNumber: '+34666666666',
        })

      expect(response.status).toBe(201)
      expect(response.body.name).toBe('pepe')
      expect(response.body.lastName).toBe('example of lastname')
      expect(response.body.email).toBe('example@of.email')
      expect(response.body.phoneNumber).toBe('+34666666666')
      expect(response.body.userId).toBeTruthy()
      expect(response.body.id).toBeTruthy()
    })
    it('/contacts (POST) uncomplete fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          lastName: 'example of lastname',
          email: 'example@of.email',
          phoneNumber: '+34666666666',
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Bad Request')
      expect(response.body.message).toBeTruthy()
    })
    it('/contacts (POST) wrong email', async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'wrong@email',
          phoneNumber: '+34666666666',
        })
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Bad Request')
      expect(response.body.message).toBeTruthy()
    })

    it('/contacts (POST) wrong phone number', async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'good@email.com',
          phoneNumber: '+34666666',
        })
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Bad Request')
      expect(response.body.message).toBeTruthy()
    })
  })
  describe('ContactsController delete contact', () => {
    let contactId: string
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'example@contact.email',
          phoneNumber: '+34666666666',
        })

      contactId = response.body.id
    })
    it('/contacts/:contactId (DELETE)', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toBeTruthy()
    })
    it('/contacts/:contactId (DELETE) non existing user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/contacts/39f600fa-99bd-11ea-bb37-0242ac130002`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Not Found')
      expect(response.body.message).toBe(
        'Contact with ID "39f600fa-99bd-11ea-bb37-0242ac130002" not found',
      )
    })
    it('/contacts/:contactId (DELETE) non uuid param', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/contacts/${contactId}wrong`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Bad Request')
      expect(response.body.message).toBe(
        'Validation failed (uuid  is expected)',
      )
    })
  })
  describe('ContactsController get contacts', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'example@of.email',
          phoneNumber: '+34666666666',
        })
    })
    it('/contacts (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contacts?page=0`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(1)
    })
    it('/contacts (GET) search non existing user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contacts?page=0&search=nobody`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(0)
    })
    it('/contacts (GET) search existing user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contacts?page=0&search=example`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(1)
    })
  })
  describe('ContactsController update contact', () => {
    let contactId: string
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'pepe',
          lastName: 'example of lastname',
          email: 'example@contact.email',
          phoneNumber: '+34666666666',
        })

      contactId = response.body.id
    })
    it('/contacts/:contactId (PUT)', async () => {
      const response = await request(app.getHttpServer())
        .put(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new name',
          lastName: 'new last name',
          email: 'new@contact.email',
          phoneNumber: '+34666666665',
        })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('new name')
      expect(response.body.lastName).toBe('new last name')
      expect(response.body.email).toBe('new@contact.email')
      expect(response.body.phoneNumber).toBe('+34666666665')
      expect(response.body.userId).toBeTruthy()
      expect(response.body.id).toBeTruthy()
    })
  })
})
