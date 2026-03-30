import { success, notFound } from '../../services/response/index.js'
import CadastroPropriedade from './model.js'

export const create = ({ bodymen: { body } }, res, next) =>
  CadastroPropriedade.create(body)
    .then((CadastroPropriedade) => CadastroPropriedade.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  CadastroPropriedade.count(query)
    .then(count => CadastroPropriedade.find(query, select, cursor)
      .then((someEntities) => ({
        count,
        rows: someEntities.map((CadastroPropriedade) => CadastroPropriedade.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  CadastroPropriedade.findById(params.id)
    .then(notFound(res))
    .then((CadastroPropriedade) => CadastroPropriedade ? CadastroPropriedade.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  CadastroPropriedade.findById(params.id)
    .then(notFound(res))
    .then((CadastroPropriedade) => CadastroPropriedade ? Object.assign(CadastroPropriedade, body).save() : null)
    .then((CadastroPropriedade) => CadastroPropriedade ? CadastroPropriedade.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  CadastroPropriedade.findById(params.id)
    .then(notFound(res))
    .then((CadastroPropriedade) => CadastroPropriedade ? CadastroPropriedade.remove() : null)
    .then(success(res, 204))
    .catch(next)
