import Dados from '../model'
import cadastroConta from '../../cadastroConta/model'
import cadastroPropriedade from '../../cadastroPropriedade/model'
import cadastroParametros from '../../cadastroParametros/model'

export const returnAllDocuments = async () => {
    const dadosPromise = await Dados.find().then(dados => dados.map(dado => dado.view()))
    const cadastroContaPromise = await cadastroConta.find().then(contas => contas.map(conta => conta.view()))
    const cadastroPropriedadePromise = await cadastroPropriedade.find().then(propriedades => propriedades.map(prop => prop.view()))
    const cadastroParametrosPromise = await cadastroParametros.find().then(parametros => parametros.map(param => param.view()))

    return {
        dados: dadosPromise,
        cadastroConta: cadastroContaPromise,
        cadastroPropriedade: cadastroPropriedadePromise,
        cadastroParametros: cadastroParametrosPromise
    }
}