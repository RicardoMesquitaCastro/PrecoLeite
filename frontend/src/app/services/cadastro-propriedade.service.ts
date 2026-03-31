import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './auth.service';

export interface CadastroPropriedade {
  contaId?: string;
  nomePropriedade: string;
  municipio: string;
  regiao: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroPropriedadeService {
  private apiUrl = `${environment.apiUrl}/cadastroPropriedade`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Cria propriedade vinculada ao usuário logado
  create(data: CadastroPropriedade): Observable<CadastroPropriedade> {
    const user = this.authService.getUser();
    const payload = {
      ...data,
      contaId: user?.id ?? ''
    };
    return this.http.post<CadastroPropriedade>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // Busca propriedades do usuário logado
  getMinhas(): Observable<{ count: number; rows: CadastroPropriedade[] }> {
    const user = this.authService.getUser();
    const params = new HttpParams().set('contaId', user?.id ?? '');
    return this.http.get<{ count: number; rows: CadastroPropriedade[] }>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders(), params }
    );
  }

  getAll(params?: any): Observable<{ count: number; rows: CadastroPropriedade[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<{ count: number; rows: CadastroPropriedade[] }>(
      `${this.apiUrl}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders(), params: httpParams }
    );
  }

  getById(id: string): Observable<CadastroPropriedade> {
    return this.http.get<CadastroPropriedade>(
      `${this.apiUrl}/${id}?access_token=${environment.MASTER_KEY}`,
      { headers: this.getHeaders() }
    );
  }

  update(id: string, data: CadastroPropriedade): Observable<CadastroPropriedade> {
    return this.http.put<CadastroPropriedade>(
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
