import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private baseUrl = 'http://localhost:9000'; // ⬅️ URL do seu backend

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
      }),
    };
  }

  cadastrarPropriedade(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/propriedades`, dados);
  }

  cadastrarParametros(parametros: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/parametros`, parametros, this.getAuthHeaders());
  }

  listarRegistros() {
    return this.http.get(`${this.baseUrl}/registros`, this.getAuthHeaders());
  }
}
