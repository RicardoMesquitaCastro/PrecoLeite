import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './auth.service';

export interface MinhaConta {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface MinhaPropriedade {
  id: string;
  nomePropriedade: string;
  municipio: string;
  regiao: string;
  createdAt: string;
}

export interface MeuParametro {
  id: string;
  laticinio: string;
  mesReferencia: string;
  precoLeite: string;
  producaoLitros: string;
  ccs: string;
  cbt: string;
  gordura: string;
  proteina: string;
  createdAt: string;
}

export interface MeusDadosCadastrais {
  conta: MinhaConta | null;
  propriedades: MinhaPropriedade[];
  parametros: MeuParametro[];
}

@Injectable({ providedIn: 'root' })
export class MeusDadosService {

  private usersUrl = `${environment.apiUrl}/users`;
  private allUrl   = 'https://precoleite-api.onrender.com/dados/all';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  /** Busca o usuário logado em /users e os dados cadastrais em /all em paralelo */
  getMeusDados(): Observable<MeusDadosCadastrais> {
    const user    = this.authService.getUser();
    const contaId = user?.id ?? '';

    const usuario$ = this.http.get<any>(
      `${this.usersUrl}/${contaId}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders() }
    );

    const all$ = this.http.get<any>(this.allUrl, { headers: this.getHeaders() });

    return forkJoin({ usuario: usuario$, all: all$ }).pipe(
      map(({ usuario, all }) => {
        const propriedades: any[] = all.cadastroPropriedade ?? [];
        const parametros:   any[] = all.cadastroParametros  ?? [];

        const minhasPropriedades = propriedades
          .filter(p => p.contaId === contaId)
          .map(p => ({
            id:              p.id,
            nomePropriedade: p.nomePropriedade,
            municipio:       p.municipio,
            regiao:          p.regiao,
            createdAt:       p.createdAt
          }));

        const meusParametros = parametros
          .filter(p => p.contaId === contaId)
          .map(p => ({
            id:             p.id,
            laticinio:      p.laticinio,
            mesReferencia:  p.mesReferencia,
            precoLeite:     p.precoLeite,
            producaoLitros: p.producaoLitros ?? '—',
            ccs:            p.ccs,
            cbt:            p.cbt,
            gordura:        p.gordura,
            proteina:       p.proteina,
            createdAt:      p.createdAt
          }));

        return {
          conta: usuario
            ? { id: usuario.id, name: usuario.name, email: usuario.email, createdAt: usuario.createdAt }
            : null,
          propriedades: minhasPropriedades,
          parametros:   meusParametros
        };
      })
    );
  }
}
