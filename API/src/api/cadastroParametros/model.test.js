import { CadastroParametros } from '.'

let cadastroParametros

beforeEach(async () => {
  cadastroParametros = await CadastroParametros.create({ contaId: 'test', mesReferencia: 'test', precoLeite: 'test', producaoLitros: 'test', ccs: 'test', cbt: 'test', gordura: 'test', proteina: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = cadastroParametros.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(cadastroParametros.id)
    expect(view.contaId).toBe(cadastroParametros.contaId)
    expect(view.mesReferencia).toBe(cadastroParametros.mesReferencia)
    expect(view.precoLeite).toBe(cadastroParametros.precoLeite)
    expect(view.producaoLitros).toBe(cadastroParametros.producaoLitros)
    expect(view.ccs).toBe(cadastroParametros.ccs)
    expect(view.cbt).toBe(cadastroParametros.cbt)
    expect(view.gordura).toBe(cadastroParametros.gordura)
    expect(view.proteina).toBe(cadastroParametros.proteina)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = cadastroParametros.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(cadastroParametros.id)
    expect(view.contaId).toBe(cadastroParametros.contaId)
    expect(view.mesReferencia).toBe(cadastroParametros.mesReferencia)
    expect(view.precoLeite).toBe(cadastroParametros.precoLeite)
    expect(view.producaoLitros).toBe(cadastroParametros.producaoLitros)
    expect(view.ccs).toBe(cadastroParametros.ccs)
    expect(view.cbt).toBe(cadastroParametros.cbt)
    expect(view.gordura).toBe(cadastroParametros.gordura)
    expect(view.proteina).toBe(cadastroParametros.proteina)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
