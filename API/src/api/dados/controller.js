import { success, notFound } from '../../services/response/'
import { Dados } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Dados.create(body)
    .then((dados) => dados.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Dados.count(query)
    .then(count => Dados.find(query, select, cursor)
      .then((dados) => ({
        count,
        rows: dados.map((dados) => dados.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Dados.findById(params.id)
    .then(notFound(res))
    .then((dados) => dados ? dados.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Dados.findById(params.id)
    .then(notFound(res))
    .then((dados) => dados ? Object.assign(dados, body).save() : null)
    .then((dados) => dados ? dados.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Dados.findById(params.id)
    .then(notFound(res))
    .then((dados) => dados ? dados.remove() : null)
    .then(success(res, 204))
    .catch(next)
