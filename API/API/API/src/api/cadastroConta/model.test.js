import { CadastroConta } from '.'

let cadastroConta

beforeEach(async () => {
  cadastroConta = await CadastroConta.create({ name: 'test', email: 'test', password: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = cadastroConta.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(cadastroConta.id)
    expect(view.name).toBe(cadastroConta.name)
    expect(view.email).toBe(cadastroConta.email)
    expect(view.password).toBe(cadastroConta.password)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = cadastroConta.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(cadastroConta.id)
    expect(view.name).toBe(cadastroConta.name)
    expect(view.email).toBe(cadastroConta.email)
    expect(view.password).toBe(cadastroConta.password)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
