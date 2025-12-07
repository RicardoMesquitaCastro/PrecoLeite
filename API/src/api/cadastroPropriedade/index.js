import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
//export CadastroPropriedade, { schema } from './model'

const router = new Router()
const { contaId, nomePropriedade, municipio, regiao } = schema.tree

/**
 * @api {post} /cadastroPropriedade Create some entity
 * @apiName CreateCadastroPropriedade
 * @apiGroup CadastroPropriedade
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam contaId Some entity's contaId.
 * @apiParam nomePropriedade Some entity's nomePropriedade.
 * @apiParam municipio Some entity's municipio.
 * @apiParam regiao Some entity's regiao.
 * @apiSuccess {Object} CadastroPropriedade Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ contaId, nomePropriedade, municipio, regiao }),
  create)

/**
 * @api {get} /cadastroPropriedade Retrieve some entities
 * @apiName RetrieveSomeEntities
 * @apiGroup CadastroPropriedade
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of some entities.
 * @apiSuccess {Object[]} rows List of some entities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /cadastroPropriedade/:id Retrieve some entity
 * @apiName RetrieveCadastroPropriedade
 * @apiGroup CadastroPropriedade
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} CadastroPropriedade Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /cadastroPropriedade/:id Update some entity
 * @apiName UpdateCadastroPropriedade
 * @apiGroup CadastroPropriedade
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam contaId Some entity's contaId.
 * @apiParam nomePropriedade Some entity's nomePropriedade.
 * @apiParam municipio Some entity's municipio.
 * @apiParam regiao Some entity's regiao.
 * @apiSuccess {Object} CadastroPropriedade Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ contaId, nomePropriedade, municipio, regiao }),
  update)

/**
 * @api {delete} /cadastroPropriedade/:id Delete some entity
 * @apiName DeleteCadastroPropriedade
 * @apiGroup CadastroPropriedade
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Some entity not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
