import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { list } from '../pages/data-parametros/dados'; // <-- seu arquivo local

export interface DadoLeite {
  _id?: any;
  regiao: any;
  municipio: any;
  laticinio: any;
  mesReferencia: any;
  anoReferencia: any;
  producaoLitros: any;
  precoLitro: any;
  ccs: any;
  cbt: any;
  gordura: any;
  proteina: any;
}

@Injectable({
  providedIn: 'root',
})
export class DadosService {
  private apiUrl = 'http://localhost:9000/dados';
  private token = 'teste';
  private usarMock = false; // ← defina `false` para usar o backend real

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  /** 🔹 Retorna lista de dados */
  getAll(params?: any): Observable<any> {
  if (this.usarMock) {
    let dadosFiltrados = list;

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] != null && params[key] !== '') {
          dadosFiltrados = dadosFiltrados.filter(
  (item) => String((item as any)[key]) === String(params[key])
);
        }
      });
    }

    return of({ count: dadosFiltrados.length, rows: dadosFiltrados });
  }

  // --- MODO BACKEND REAL ---
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.set(key, params[key]);
    });
  }

  // 🔥 ALTERAÇÃO AQUI: adicionar /all
  return this.http.get<any>(`${this.apiUrl}/all`, {
    headers: this.getHeaders(),
    params: httpParams,
  });
}

  /** 🔹 Cadastrar novo registro */
  create(dado: DadoLeite): Observable<DadoLeite> {
    if (this.usarMock) {
      console.log('📦 Mock create:', dado);
      list.push(dado);
      return of(dado);
    }
    return this.http.post<DadoLeite>(this.apiUrl, dado, {
      headers: this.getHeaders(),
    });
  }

  /** 🔹 Buscar por ID */
  // getById(id: string): Observable<DadoLeite> {
  //   if (this.usarMock) {
  //     const item = list.find((d) => d._id === id);
  //     return of(item as DadoLeite);
  //   }
  //   return this.http.get<DadoLeite>(`${this.apiUrl}/${id}`, {
  //     headers: this.getHeaders(),
  //   });
  // }

  /** 🔹 Atualizar registro */
  // update(id: string, dado: DadoLeite): Observable<DadoLeite> {
  //   if (this.usarMock) {
  //     const idx = list.findIndex((d) => d._id === id);
  //     if (idx >= 0) list[idx] = { ...list[idx], ...dado };
  //     return of(list[idx]);
  //   }
  //   return this.http.put<DadoLeite>(`${this.apiUrl}/${id}`, dado, {
  //     headers: this.getHeaders(),
  //   });
  // }

  /** 🔹 Excluir registro */
  // delete(id: string): Observable<void> {
  //   if (this.usarMock) {
  //     const idx = list.findIndex((d) => d._id === id);
  //     if (idx >= 0) list.splice(idx, 1);
  //     return of(void 0);
  //   }
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`, {
  //     headers: this.getHeaders(),
  //   });
  // }
}
