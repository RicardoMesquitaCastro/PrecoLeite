import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import express from '../../services/express'
import routes, { CadastroParametros } from '.'

const app = () => express(apiRoot, routes)

let cadastroParametros

beforeEach(async () => {
  cadastroParametros = await CadastroParametros.create({})
})

test('POST /cadastroParametros 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, contaId: 'test', mesReferencia: 'test', laticinio: 'test', precoLeite: 'test', producaoLitros: 'test', ccs: 'test', cbt: 'test', gordura: 'test', proteina: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.contaId).toEqual('test')
  expect(body.mesReferencia).toEqual('test')
  expect(body.laticinio).toEqual('test')
  expect(body.precoLeite).toEqual('test')
  expect(body.producaoLitros).toEqual('test')
  expect(body.ccs).toEqual('test')
  expect(body.cbt).toEqual('test')
  expect(body.gordura).toEqual('test')
  expect(body.proteina).toEqual('test')
})

test('POST /cadastroParametros 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroParametros 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /cadastroParametros 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /cadastroParametros/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${cadastroParametros.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(cadastroParametros.id)
})

test('GET /cadastroParametros/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${cadastroParametros.id}`)
  expect(status).toBe(401)
})

test('GET /cadastroParametros/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /cadastroParametros/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${cadastroParametros.id}`)
    .send({ access_token: masterKey, contaId: 'test', mesReferencia: 'test',  laticinio: 'test', precoLeite: 'test', producaoLitros: 'test', ccs: 'test', cbt: 'test', gordura: 'test', proteina: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(cadastroParametros.id)
  expect(body.contaId).toEqual('test')
  expect(body.mesReferencia).toEqual('test')
  expect(body.laticinio).toEqual('test')
  expect(body.precoLeite).toEqual('test')
  expect(body.producaoLitros).toEqual('test')
  expect(body.ccs).toEqual('test')
  expect(body.cbt).toEqual('test')
  expect(body.gordura).toEqual('test')
  expect(body.proteina).toEqual('test')
})

test('PUT /cadastroParametros/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${cadastroParametros.id}`)
  expect(status).toBe(401)
})

test('PUT /cadastroParametros/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, contaId: 'test', mesReferencia: 'test', laticinio: 'test', precoLeite: 'test', producaoLitros: 'test', ccs: 'test', cbt: 'test', gordura: 'test', proteina: 'test' })
  expect(status).toBe(404)
})

test('DELETE /cadastroParametros/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${cadastroParametros.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /cadastroParametros/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${cadastroParametros.id}`)
  expect(status).toBe(401)
})

test('DELETE /cadastroParametros/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
