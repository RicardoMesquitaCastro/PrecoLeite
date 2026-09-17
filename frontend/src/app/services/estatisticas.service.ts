import { Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { DadosService, DadoLeite } from 'src/app/services/dados.service';

export interface DadoDetalhe {
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

export interface FiltroDetalhe {
  tipo: 'laticinio' | 'mes' | 'regiao';
  laticinio?: string;
  faixaMin?: number;
  faixaMax?: number;
  mesNumero?: number;
  mesNome?: string;
  regiao?: string;
  municipio?: string;
  ano?: number;
}

export interface EstatisticasDetalhe {
  mediaPreco: number;
  minPreco: number;
  maxPreco: number;
  totalRegistros: number;
  mediaProducao: number;
  mediaCCS: number;
  mediaCBT: number;
  mediaGordura: number;
  mediaProteina: number;
  itens: DadoDetalhe[];
}

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

@Injectable({ providedIn: 'root' })
export class EstatisticasService {

  private dados$!: Observable<DadoLeite[]>;

  constructor(private dadosService: DadosService) {}

  getDados(): Observable<DadoLeite[]> {
    if (!this.dados$) {
      this.dados$ = this.dadosService.getAll().pipe(
        map((res: any) => {
          const propriedades = res.cadastroPropriedade as any[];
          const parametros   = res.cadastroParametros  as any[];

          return parametros.map((p: any) => {
            // Busca a propriedade pelo contaId (dados de produtores cadastrados)
            const prop = propriedades.find((pr: any) => pr.contaId === p.contaId) || {};

            // Prioridade:
            // 1. municipio/regiao salvos direto no parâmetro (dados coletados pelo admin)
            // 2. municipio/regiao da propriedade vinculada ao contaId (dados de produtores)
            const municipio = p.municipio?.trim() || prop.municipio || '';
            const regiao    = p.regiao?.trim()    || prop.regiao    || '';

            return {
              laticinio:      p.laticinio,
              regiao,
              municipio,
              mesReferencia:  Number(p.mesReferencia),
              anoReferencia:  new Date(p.createdAt).getFullYear(),
              producaoLitros: Number(p.producaoLitros),
              precoLitro:     Number(p.precoLeite),
              ccs:            Number(p.ccs),
              cbt:            Number(p.cbt),
              gordura:        Number(p.gordura),
              proteina:       Number(p.proteina),
            } as DadoLeite;
          });
        }),
        shareReplay(1)
      );
    }
    return this.dados$;
  }

  // Invalida o cache — chame após cadastrar novos parâmetros para forçar recarga
  invalidarCache() {
    this.dados$ = undefined as any;
  }

  calcularEstatisticas(dados: DadoLeite[], filtro: FiltroDetalhe): EstatisticasDetalhe {
    let itens = dados.filter(d => {
      if (filtro.municipio && filtro.municipio !== 'geral' && d.municipio !== filtro.municipio) return false;
      if (filtro.ano && d.anoReferencia !== filtro.ano) return false;
      return true;
    });

    if (filtro.tipo === 'laticinio') {
      if (filtro.laticinio) itens = itens.filter(d => d.laticinio === filtro.laticinio);
      if (filtro.faixaMin != null && filtro.faixaMax != null) {
        itens = itens.filter(d =>
          d.producaoLitros >= filtro.faixaMin! &&
          d.producaoLitros <= filtro.faixaMax!
        );
      }
    }

    if (filtro.tipo === 'mes' && filtro.mesNumero != null) {
      itens = itens.filter(d => d.mesReferencia === filtro.mesNumero);
    }

    if (filtro.tipo === 'regiao' && filtro.regiao) {
      itens = itens.filter(d => d.regiao === filtro.regiao);
    }

    const precos = itens.map(d => d.precoLitro);
    const soma   = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const media  = (arr: number[]) => arr.length ? soma(arr) / arr.length : 0;

    return {
      totalRegistros: itens.length,
      mediaPreco:     media(precos),
      minPreco:       precos.length ? Math.min(...precos) : 0,
      maxPreco:       precos.length ? Math.max(...precos) : 0,
      mediaProducao:  media(itens.map(d => d.producaoLitros)),
      mediaCCS:       media(itens.map(d => d.ccs)),
      mediaCBT:       media(itens.map(d => d.cbt)),
      mediaGordura:   media(itens.map(d => d.gordura)),
      mediaProteina:  media(itens.map(d => d.proteina)),
      itens,
    };
  }

  nomeMes(indice: number): string {
    return MESES[indice] ?? 'Desconhecido';
  }
}
