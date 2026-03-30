import { CadastroPropriedade } from '.'

let someEntity

beforeEach(async () => {
  someEntity = await CadastroPropriedade.create({ cadastroId: 'test', nomePropriedade: 'test', municipio: 'test', regiao: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = someEntity.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(someEntity.id)
    expect(view.cadastroId).toBe(someEntity.cadastroId)
    expect(view.nomePropriedade).toBe(someEntity.nomePropriedade)
    expect(view.municipio).toBe(someEntity.municipio)
    expect(view.regiao).toBe(someEntity.regiao)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = someEntity.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(someEntity.id)
    expect(view.cadastroId).toBe(someEntity.cadastroId)
    expect(view.nomePropriedade).toBe(someEntity.nomePropriedade)
    expect(view.municipio).toBe(someEntity.municipio)
    expect(view.regiao).toBe(someEntity.regiao)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
