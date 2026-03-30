import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import express from '../../services/express'
import routes, { CadastroConta } from '.'

const app = () => express(apiRoot, routes)

let cadastroConta

beforeEach(async () => {
  cadastroConta = await CadastroConta.create({})
})

test('POST /cadastroContas 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, name: 'test', email: 'test', password: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.email).toEqual('test')
  expect(body.password).toEqual('test')
})

test('POST /cadastroContas 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroContas 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /cadastroContas 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroContas/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${cadastroConta.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(cadastroConta.id)
})

test('GET /cadastroContas/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${cadastroConta.id}`)
  expect(status).toBe(401)
})

test('GET /cadastroContas/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /cadastroContas/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${cadastroConta.id}`)
    .send({ access_token: masterKey, name: 'test', email: 'test', password: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(cadastroConta.id)
  expect(body.name).toEqual('test')
  expect(body.email).toEqual('test')
  expect(body.password).toEqual('test')
})

test('PUT /cadastroContas/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${cadastroConta.id}`)
  expect(status).toBe(401)
})

test('PUT /cadastroContas/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, name: 'test', email: 'test', password: 'test' })
  expect(status).toBe(404)
})

test('DELETE /cadastroContas/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${cadastroConta.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /cadastroContas/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${cadastroConta.id}`)
  expect(status).toBe(401)
})

test('DELETE /cadastroContas/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
