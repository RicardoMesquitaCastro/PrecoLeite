import { Router } from 'express'
import { login, loginGoogle } from './controller'
import { password, master } from '../../services/passport'

const router = new Router()

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission master
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post('/',
  master(),
  password(),
  login)

/**
 * @api {post} /auth/google Authenticate with Google
 * @apiName AuthenticateGoogle
 * @apiGroup Auth
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} idToken Google ID Token obtido pelo frontend.
 * @apiSuccess (Success 201) {String} token User `access_token`.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 400 idToken is required.
 * @apiError 401 Invalid Google token.
 */
router.post('/google',
  master(),
  loginGoogle)

export default router
