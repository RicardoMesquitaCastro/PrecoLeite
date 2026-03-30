import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, returnAll } from './controller'
import { schema } from './model'

const router = new Router()
const { propriedade, municipio, regiao } = schema.tree

//------------------------------------------------------
// 🔥 ROTA /all — DEVE SER A PRIMEIRA DE TODAS
//------------------------------------------------------
router.get('/all', returnAll)

//------------------------------------------------------
// ROTAS NORMAIS
//------------------------------------------------------

router.post('/',
  body({ propriedade, municipio, regiao }),
  create
)

router.get('/',
  query(),
  index
)

router.get('/:id',
  show
)

router.put('/:id',
  body({ propriedade, municipio, regiao }),
  update
)

router.delete('/:id',
  destroy
)

export default router
