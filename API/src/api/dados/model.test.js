import { Dados } from '.'

let dados

beforeEach(async () => {
  dados = await Dados.create({ propriedade: 'test', municipio: 'test', regiao: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = dados.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(dados.id)
    expect(view.propriedade).toBe(dados.propriedade)
    expect(view.municipio).toBe(dados.municipio)
    expect(view.regiao).toBe(dados.regiao)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = dados.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(dados.id)
    expect(view.propriedade).toBe(dados.propriedade)
    expect(view.municipio).toBe(dados.municipio)
    expect(view.regiao).toBe(dados.regiao)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
