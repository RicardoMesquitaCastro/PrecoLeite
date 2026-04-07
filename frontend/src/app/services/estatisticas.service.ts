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
  // Para laticínio
  laticinio?: string;
  faixaMin?: number;
  faixaMax?: number;
  // Para mês
  mesNumero?: number;
  mesNome?: string;
  // Para região
  regiao?: string;
  // Comuns
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

  /** Cache único da requisição — compartilhado com DataParametrosPage */
  private dados$!: Observable<DadoLeite[]>;

  constructor(private dadosService: DadosService) {}

  /** Retorna (e cacheia) a lista completa de dados já mapeados */
  getDados(): Observable<DadoLeite[]> {
    if (!this.dados$) {
      this.dados$ = this.dadosService.getAll().pipe(
        map((res: any) => {
          const propriedades = res.cadastroPropriedade;
          const parametros   = res.cadastroParametros;

          return parametros.map((p: any) => {
            const prop = propriedades.find((pr: any) => pr.contaId === p.contaId) || {};
            return {
              laticinio:      p.laticinio,
              regiao:         prop.regiao    ?? '',
              municipio:      prop.municipio ?? '',
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
        shareReplay(1)   // ← uma só requisição HTTP para toda a sessão
      );
    }
    return this.dados$;
  }

  /** Filtra a lista conforme o FiltroDetalhe e retorna as estatísticas */
  calcularEstatisticas(
    dados: DadoLeite[],
    filtro: FiltroDetalhe
  ): EstatisticasDetalhe {
    let itens = dados.filter(d => {
      if (filtro.municipio && filtro.municipio !== 'geral' && d.municipio !== filtro.municipio) return false;
      if (filtro.ano        && d.anoReferencia !== filtro.ano)                                   return false;
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

    if (filtro.tipo === 'mes') {
      if (filtro.mesNumero != null) {
        itens = itens.filter(d => d.mesReferencia === filtro.mesNumero);
      }
    }

    if (filtro.tipo === 'regiao') {
      if (filtro.regiao) itens = itens.filter(d => d.regiao === filtro.regiao);
    }

    const precos   = itens.map(d => d.precoLitro);
    const soma     = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const media    = (arr: number[]) => arr.length ? soma(arr) / arr.length : 0;

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

  /** Utilitário: nome do mês a partir do índice 0-based */
  nomeMes(indice: number): string {
    return MESES[indice] ?? 'Desconhecido';
  }
}
