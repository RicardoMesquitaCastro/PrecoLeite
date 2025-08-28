import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Dados, { schema } from './model'

const router = new Router()
const { propriedade, municipio, regiao } = schema.tree

/**
 * @api {post} /dados Create dados
 * @apiName CreateDados
 * @apiGroup Dados
 * @apiParam propriedade Dados's propriedade.
 * @apiParam municipio Dados's municipio.
 * @apiParam regiao Dados's regiao.
 * @apiSuccess {Object} dados Dados's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Dados not found.
 */
router.post('/',
  body({ propriedade, municipio, regiao }),
  create)

/**
 * @api {get} /dados Retrieve dados
 * @apiName RetrieveDados
 * @apiGroup Dados
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of dados.
 * @apiSuccess {Object[]} rows List of dados.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /dados/:id Retrieve dados
 * @apiName RetrieveDados
 * @apiGroup Dados
 * @apiSuccess {Object} dados Dados's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Dados not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /dados/:id Update dados
 * @apiName UpdateDados
 * @apiGroup Dados
 * @apiParam propriedade Dados's propriedade.
 * @apiParam municipio Dados's municipio.
 * @apiParam regiao Dados's regiao.
 * @apiSuccess {Object} dados Dados's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Dados not found.
 */
router.put('/:id',
  body({ propriedade, municipio, regiao }),
  update)

/**
 * @api {delete} /dados/:id Delete dados
 * @apiName DeleteDados
 * @apiGroup Dados
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Dados not found.
 */
router.delete('/:id',
  destroy)

export default router
