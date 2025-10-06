import { success, notFound } from '../../services/response/'
import { CadastroConta } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  CadastroConta.create(body)
    .then((cadastroConta) => cadastroConta.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  CadastroConta.count(query)
    .then(count => CadastroConta.find(query, select, cursor)
      .then((cadastroContas) => ({
        count,
        rows: cadastroContas.map((cadastroConta) => cadastroConta.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then((cadastroConta) => cadastroConta ? cadastroConta.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then((cadastroConta) => cadastroConta ? Object.assign(cadastroConta, body).save() : null)
    .then((cadastroConta) => cadastroConta ? cadastroConta.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then((cadastroConta) => cadastroConta ? cadastroConta.remove() : null)
    .then(success(res, 204))
    .catch(next)
