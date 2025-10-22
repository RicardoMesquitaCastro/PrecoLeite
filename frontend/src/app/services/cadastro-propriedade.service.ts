import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CadastroPropriedade {
  _id?: string;
  cadastroId?: string; // opcional, se vinculado a outro cadastro
  nomePropriedade: string;
  municipio: string;
  regiao: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroPropriedadeService {
  private apiUrl = 'http://localhost:9000/cadastroPropriedade';
  private token = 'masterKey'; // token master padrão

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  create(data: CadastroPropriedade): Observable<CadastroPropriedade> {
    return this.http.post<CadastroPropriedade>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  getAll(params?: any): Observable<{ count: number; rows: CadastroPropriedade[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<{ count: number; rows: CadastroPropriedade[] }>(this.apiUrl, {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  getById(id: string): Observable<CadastroPropriedade> {
    return this.http.get<CadastroPropriedade>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  update(id: string, data: CadastroPropriedade): Observable<CadastroPropriedade> {
    return this.http.put<CadastroPropriedade>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
