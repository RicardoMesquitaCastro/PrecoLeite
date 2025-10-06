import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
//export CadastroParametros, { schema } from './model'

const router = new Router()
const { contaId, mesReferencia, precoLeite, producaoLitros, ccs, cbt, gordura, proteina } = schema.tree

/**
 * @api {post} /cadastroParametros Create cadastro parametros
 * @apiName CreateCadastroParametros
 * @apiGroup CadastroParametros
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam contaId Cadastro parametros's contaId.
 * @apiParam mesReferencia Cadastro parametros's mesReferencia.
 * @apiParam precoLeite Cadastro parametros's precoLeite.
 * @apiParam producaoLitros Cadastro parametros's producaoLitros.
 * @apiParam ccs Cadastro parametros's ccs.
 * @apiParam cbt Cadastro parametros's cbt.
 * @apiParam gordura Cadastro parametros's gordura.
 * @apiParam proteina Cadastro parametros's proteina.
 * @apiSuccess {Object} cadastroParametros Cadastro parametros's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro parametros not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ contaId, mesReferencia, precoLeite, producaoLitros, ccs, cbt, gordura, proteina }),
  create)

/**
 * @api {get} /cadastroParametros Retrieve cadastro parametros
 * @apiName RetrieveCadastroParametros
 * @apiGroup CadastroParametros
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of cadastro parametros.
 * @apiSuccess {Object[]} rows List of cadastro parametros.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /cadastroParametros/:id Retrieve cadastro parametros
 * @apiName RetrieveCadastroParametros
 * @apiGroup CadastroParametros
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} cadastroParametros Cadastro parametros's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro parametros not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /cadastroParametros/:id Update cadastro parametros
 * @apiName UpdateCadastroParametros
 * @apiGroup CadastroParametros
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam contaId Cadastro parametros's contaId.
 * @apiParam mesReferencia Cadastro parametros's mesReferencia.
 * @apiParam precoLeite Cadastro parametros's precoLeite.
 * @apiParam producaoLitros Cadastro parametros's producaoLitros.
 * @apiParam ccs Cadastro parametros's ccs.
 * @apiParam cbt Cadastro parametros's cbt.
 * @apiParam gordura Cadastro parametros's gordura.
 * @apiParam proteina Cadastro parametros's proteina.
 * @apiSuccess {Object} cadastroParametros Cadastro parametros's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Cadastro parametros not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ contaId, mesReferencia, precoLeite, producaoLitros, ccs, cbt, gordura, proteina }),
  update)

/**
 * @api {delete} /cadastroParametros/:id Delete cadastro parametros
 * @apiName DeleteCadastroParametros
 * @apiGroup CadastroParametros
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Cadastro parametros not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
