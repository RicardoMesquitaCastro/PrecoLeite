import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CadastroParametros {
  _id?: string;
  contaId: string;
  mesReferencia: string;
  precoLeite: number;
  producaoLitros: number;
  ccs: number;
  cbt: number;
  gordura: number;
  proteina: number;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroParametrosService {
  private apiUrl = 'http://localhost:9000/cadastroParametros'; // URL do seu backend
  private token = 'masterKey'; // token master padrão

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  create(data: CadastroParametros): Observable<CadastroParametros> {
    return this.http.post<CadastroParametros>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  getAll(params?: any): Observable<{ count: number; rows: CadastroParametros[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<{ count: number; rows: CadastroParametros[] }>(this.apiUrl, {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  getById(id: string): Observable<CadastroParametros> {
    return this.http.get<CadastroParametros>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  update(id: string, data: CadastroParametros): Observable<CadastroParametros> {
    return this.http.put<CadastroParametros>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
