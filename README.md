
ionic capacitor run android -l --external

ionic build
npx cap sync android
npx cap open android

    <item name="android:background">@drawable/logo</item>

//////////////////////////////////////////////////////////
    GET retorno para estatisticas precisa retornar os dados

    export interface DadoLeite {
  laticinio: string;
  regiao: string;
  municipio: string;
  mesReferencia: number;
  anoReferencia: number;
  producaoLitros: number;
  precoLitro: number;
  ccs: number;
  cbt: number;
  gordura: number;
  proteina: number;
}
//////////////////////////////////////////////////////////

POST. No post sera dividido em telas
1: Cadastro 
  const dadosCadastro = {
      nome: string,
      email: string,    //ESTOU EM DUVIDA SE PEÇO EMAIL. Pois o publico que atenderei alguns nem sabe o email
      senha: string,
    };

2: Cadastro propriedade
    const dadosPropriedade = {
      propriedade: string,
      municipio: string,
      regiao: string
    };

3: Cadastro de parametros 
   const dadosParametros = {
    mesReferencia: number;
    laticinio: string;
    regiao: string;
    municipio: string;
    ccs: number;
    cbt: number;
    gordura: number;
    proteina: number;
   }

   O ítem 3 será inserido por mes . O mês referencia sempre será o mês anterior, para salvar esse dado mesReferencia creio que alguns usuários iram querer colocar o atual, quando acontecer preciso que altere para o mes anterior. Não sei se é mais viável fazer no front ou back.