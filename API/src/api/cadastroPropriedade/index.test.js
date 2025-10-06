import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import express from '../../services/express'
import routes, { CadastroPropriedade } from '.'

const app = () => express(apiRoot, routes)

let someEntity

beforeEach(async () => {
  someEntity = await CadastroPropriedade.create({})
})

test('POST /cadastroPropriedade 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, cadastroId: 'test', nomePropriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.cadastroId).toEqual('test')
  expect(body.nomePropriedade).toEqual('test')
  expect(body.municipio).toEqual('test')
  expect(body.regiao).toEqual('test')
})

test('POST /cadastroPropriedade 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroPropriedade 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /cadastroPropriedade 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroPropriedade/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${someEntity.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(someEntity.id)
})

test('GET /cadastroPropriedade/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(401)
})

test('GET /cadastroPropriedade/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /cadastroPropriedade/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${someEntity.id}`)
    .send({ access_token: masterKey, cadastroId: 'test', nomePropriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(someEntity.id)
  expect(body.cadastroId).toEqual('test')
  expect(body.nomePropriedade).toEqual('test')
  expect(body.municipio).toEqual('test')
  expect(body.regiao).toEqual('test')
})

test('PUT /cadastroPropriedade/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(401)
})

test('PUT /cadastroPropriedade/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, cadastroId: 'test', nomePropriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(404)
})

test('DELETE /cadastroPropriedade/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${someEntity.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /cadastroPropriedade/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(401)
})

test('DELETE /cadastroPropriedade/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
