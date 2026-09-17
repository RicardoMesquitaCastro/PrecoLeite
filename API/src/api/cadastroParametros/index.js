import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'

const router = new Router()
const { contaId, mesReferencia, laticinio, precoLeite, producaoLitros, ccs, cbt, gordura, proteina, municipio, regiao } = schema.tree

router.post('/',
  master(),
  body({ contaId, mesReferencia, laticinio, precoLeite, producaoLitros, ccs, cbt, gordura, proteina, municipio, regiao }),
  create)

router.get('/',
  master(),
  query(),
  index)

router.get('/:id',
  master(),
  show)

router.put('/:id',
  master(),
  body({ contaId, mesReferencia, laticinio, precoLeite, producaoLitros, ccs, cbt, gordura, proteina, municipio, regiao }),
  update)

router.delete('/:id',
  master(),
  destroy)

export default router
