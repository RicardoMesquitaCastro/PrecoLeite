import Dados from '../model'
import { CadastroConta } from '../../cadastroConta/model'
import CadastroPropriedade from '../../cadastroPropriedade/model'
import CadastroParametros from '../../cadastroParametros/model'

console.log('📌 MODELOS IMPORTADOS:')
console.log('Dados:', Dados)
console.log('CadastroConta:', CadastroConta)
console.log('CadastroPropriedade:', CadastroPropriedade)
console.log('CadastroParametros:', CadastroParametros)

export const returnAllDocuments = async () => {
    console.log('📌 INICIANDO returnAllDocuments...')

    const dadosPromise = await Dados.find().then(dados => {
        console.log('🔹 Dados encontrados:', dados.length)
        return dados.map(dado => dado.view())
    })

    const cadastroContaPromise = await CadastroConta.find().then(contas => {
        console.log('🔹 Contas encontradas:', contas.length)
        return contas.map(conta => conta.view())
    })

    const cadastroPropriedadePromise = await CadastroPropriedade.find().then(propriedades => {
        console.log('🔹 Propriedades encontradas:', propriedades.length)
        return propriedades.map(prop => prop.view())
    })

    const cadastroParametrosPromise = await CadastroParametros.find().then(parametros => {
        console.log('🔹 Parametros encontrados:', parametros.length)
        return parametros.map(param => param.view())
    })

    return {
        dados: dadosPromise,
        cadastroConta: cadastroContaPromise,
        cadastroPropriedade: cadastroPropriedadePromise,
        cadastroParametros: cadastroParametrosPromise
    }
}
