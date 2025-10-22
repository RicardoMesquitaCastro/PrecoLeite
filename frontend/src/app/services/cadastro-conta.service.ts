import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export interface CadastroConta {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class CadastroContaService {
  private apiUrl = 'http://localhost:9000/cadastroContas'; // ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // token master de autenticação
    const token = 'masterKey';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** CREATE */
  create(conta: CadastroConta): Observable<CadastroConta> {
    return this.http.post<CadastroConta>(this.apiUrl, conta, { headers: this.getHeaders() });
  }

  /** READ (lista todas) */
getAll(): Observable<CadastroConta[]> {
  console.log('➡️ Entrou no método getAll()');

  // Mock de dados
  const mockData: CadastroConta[] = [
    { _id: '1', name: 'João Silva', email: 'joao@example.com', password: '123456' },
    { _id: '2', name: 'Maria Souza', email: 'maria@example.com', password: 'abcdef' },
    { _id: '3', name: 'Carlos Lima', email: 'carlos@example.com', password: 'qwerty' }
  ];

  return of(mockData).pipe(
    tap(res => console.log('📦 CadastroConta mock recebido:', res)),
    catchError(err => {
      console.error('❌ Erro mockando dados:', err);
      return of([]); // fallback
    })
  );
}
  /** READ (por ID) */
  getById(id: string): Observable<CadastroConta> {
    return this.http.get<CadastroConta>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /** UPDATE */
  update(id: string, conta: CadastroConta): Observable<CadastroConta> {
    return this.http.put<CadastroConta>(`${this.apiUrl}/${id}`, conta, { headers: this.getHeaders() });
  }

  /** DELETE */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
