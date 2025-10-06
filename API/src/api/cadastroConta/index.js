import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
//export CadastroConta, { schema } from './model'

const router = new Router()
const { name, email, password } = schema.tree

/**
 * @api {post} /cadastroContas Create cadastro conta
 * @apiName CreateCadastroConta
 * @apiGroup CadastroConta
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam name Cadastro conta's name.
 * @apiParam email Cadastro conta's email.
 * @apiParam password Cadastro conta's password.
 * @apiSuccess {Object} cadastroConta Cadastro conta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro conta not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ name, email, password }),
  create)

/**
 * @api {get} /cadastroContas Retrieve cadastro contas
 * @apiName RetrieveCadastroContas
 * @apiGroup CadastroConta
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of cadastro contas.
 * @apiSuccess {Object[]} rows List of cadastro contas.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /cadastroContas/:id Retrieve cadastro conta
 * @apiName RetrieveCadastroConta
 * @apiGroup CadastroConta
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} cadastroConta Cadastro conta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro conta not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /cadastroContas/:id Update cadastro conta
 * @apiName UpdateCadastroConta
 * @apiGroup CadastroConta
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam name Cadastro conta's name.
 * @apiParam email Cadastro conta's email.
 * @apiParam password Cadastro conta's password.
 * @apiSuccess {Object} cadastroConta Cadastro conta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro conta not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ name, email, password }),
  update)

/**
 * @api {delete} /cadastroContas/:id Delete cadastro conta
 * @apiName DeleteCadastroConta
 * @apiGroup CadastroConta
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Cadastro conta not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
