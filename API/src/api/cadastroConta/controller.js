import { success, notFound } from '../../services/response/index.js';
import { CadastroConta } from './model.js';

// CREATE
export const create = ({ bodymen: { body } }, res, next) => {
  console.log('📥 Body recebido do frontend:', body);
  console.log('🧩 CadastroConta importado:', CadastroConta);

  CadastroConta.create(body)
    .then(cadastroConta => cadastroConta.view(true))
    .then(success(res, 201))
    .catch(next);
};

// LIST ALL
export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  console.log('🧩 CadastroConta no index:', CadastroConta);

  CadastroConta.countDocuments(query)
    .then(count =>
      CadastroConta.find(query, select, cursor)
        .then(cadastroContas => ({
          count,
          rows: cadastroContas.map(c => c.view())
        }))
    )
    .then(success(res))
    .catch(next);
};

// SHOW
export const show = ({ params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then(cadastroConta => cadastroConta ? cadastroConta.view() : null)
    .then(success(res))
    .catch(next);

// UPDATE
export const update = ({ bodymen: { body }, params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then(cadastroConta => cadastroConta ? Object.assign(cadastroConta, body).save() : null)
    .then(cadastroConta => cadastroConta ? cadastroConta.view(true) : null)
    .then(success(res))
    .catch(next);

// DELETE
export const destroy = ({ params }, res, next) =>
  CadastroConta.findById(params.id)
    .then(notFound(res))
    .then(cadastroConta => cadastroConta ? cadastroConta.remove() : null)
    .then(success(res, 204))
