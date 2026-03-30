import { success, notFound } from '../../services/response/'
import  CadastroParametros  from './model.js'

export const create = ({ bodymen: { body } }, res, next) =>
  CadastroParametros.create(body)
    .then((cadastroParametros) => cadastroParametros.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  CadastroParametros.count(query)
    .then(count => CadastroParametros.find(query, select, cursor)
      .then((cadastroParametros) => ({
        count,
        rows: cadastroParametros.map((cadastroParametros) => cadastroParametros.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  CadastroParametros.findById(params.id)
    .then(notFound(res))
    .then((cadastroParametros) => cadastroParametros ? cadastroParametros.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  CadastroParametros.findById(params.id)
    .then(notFound(res))
    .then((cadastroParametros) => cadastroParametros ? Object.assign(cadastroParametros, body).save() : null)
    .then((cadastroParametros) => cadastroParametros ? cadastroParametros.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  CadastroParametros.findById(params.id)
    .then(notFound(res))
    .then((cadastroParametros) => cadastroParametros ? cadastroParametros.remove() : null)
    .then(success(res, 204))
    .catch(next)
