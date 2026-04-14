import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './auth.service';

export interface CadastroParametros {
  contaId?: string;
  laticinio: string;
  mesReferencia: string;
  precoLeite: number;
  producaoLitros: number;
  ccs: number;
  cbt: number;
  gordura: number;
  proteina: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroParametrosService {
  private apiUrl = `${environment.apiUrl}/cadastroParametros`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Cria parâmetro vinculado ao usuário logado
  create(data: CadastroParametros): Observable<CadastroParametros> {
    const user = this.authService.getUser();
    const payload = { ...data, contaId: user?.id ?? '' };
    return this.http.post<CadastroParametros>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // Busca parâmetros do usuário logado
  getMeus(): Observable<{ count: number; rows: CadastroParametros[] }> {
    const user = this.authService.getUser();
    const params = new HttpParams().set('contaId', user?.id ?? '');
    return this.http.get<{ count: number; rows: CadastroParametros[] }>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders(), params }
    );
  }

  getAll(params?: any): Observable<{ count: number; rows: CadastroParametros[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<{ count: number; rows: CadastroParametros[] }>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders(), params: httpParams }
    );
  }

  getById(id: string): Observable<CadastroParametros> {
    return this.http.get<CadastroParametros>(
      `${this.apiUrl}/${id}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders() }
    );
  }

  update(id: string, data: CadastroParametros): Observable<CadastroParametros> {
    return this.http.put<CadastroParametros>(
      `${this.apiUrl}/${id}?access_token=${environment.MASTER_KEY}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders() }
    );
  }
}
