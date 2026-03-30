import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Dados } from '.'

const app = () => express(apiRoot, routes)

let dados

beforeEach(async () => {
  dados = await Dados.create({})
})

test('POST /dados 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ propriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.propriedade).toEqual('test')
  expect(body.municipio).toEqual('test')
  expect(body.regiao).toEqual('test')
})

test('GET /dados 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /dados/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${dados.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(dados.id)
})

test('GET /dados/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /dados/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${dados.id}`)
    .send({ propriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(dados.id)
  expect(body.propriedade).toEqual('test')
  expect(body.municipio).toEqual('test')
  expect(body.regiao).toEqual('test')
})

test('PUT /dados/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ propriedade: 'test', municipio: 'test', regiao: 'test' })
  expect(status).toBe(404)
})

test('DELETE /dados/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${dados.id}`)
  expect(status).toBe(204)
})

test('DELETE /dados/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
