import { success, notFound } from '../../services/response/index.js'
import { Cotacao } from './model.js'

// LIST ALL — público, o gráfico usa isso
export const index = (req, res, next) =>
  Cotacao.find({}).sort({ createdAt: 1 })
    .then(cotacoes => cotacoes.map(c => c.view()))
    .then(success(res))
    .catch(next)

// CREATE — apenas admin
export const create = ({ bodymen: { body } }, res, next) =>
  Cotacao.create(body)
    .then(cotacao => cotacao.view())
    .then(success(res, 201))
    .catch(next)

// UPDATE — apenas admin
export const update = ({ bodymen: { body }, params }, res, next) =>
  Cotacao.findById(params.id)
    .then(notFound(res))
    .then(cotacao => cotacao ? Object.assign(cotacao, body).save() : null)
    .then(cotacao => cotacao ? cotacao.view() : null)
    .then(success(res))
    .catch(next)

// DELETE — apenas admin
export const destroy = ({ params }, res, next) =>
  Cotacao.findById(params.id)
    .then(notFound(res))
    .then(cotacao => cotacao ? cotacao.remove() : null)
    .then(success(res, 204))
    .catch(next)
