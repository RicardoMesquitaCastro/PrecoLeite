import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { index, create, update, destroy } from './controller'
import { schema } from './model'

const router = new Router()
const { mes, preco } = schema.tree

// GET /cotacoes — público (gráfico carrega sem autenticação)
router.get('/', index)

// POST /cotacoes — apenas admin
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ mes, preco }),
  create)

// PUT /cotacoes/:id — apenas admin
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ mes, preco }),
  update)

// DELETE /cotacoes/:id — apenas admin
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
