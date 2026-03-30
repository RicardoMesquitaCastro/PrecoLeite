import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;
  private tokenKey = 'auth-token';
  private masterKey = 'a8d7c1f49e257252e02d3088cfa082a3'; // valor do MASTER_KEY no seu .env

  constructor(private http: HttpClient, private router: Router) {}

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  // O backend usa Basic Auth (email:senha) + master token como query param
  login(email: string, password: string): Observable<{ token: string; user: any }> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${email}:${password}`)
    });

    return this.http
      .post<{ token: string; user: any }>(
        `${this.authUrl}?access_token=${this.masterKey}`,
        {},
        { headers }
      )
      .pipe(tap(res => this.saveToken(res.token)));
  }

  // ─── REGISTRO ────────────────────────────────────────────────────────────
  // Cria um novo CadastroConta via POST /cadastroContas (requer master token)
  // O email precisa ser válido (ex: usuario@email.com)
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.usersUrl}?access_token=${this.masterKey}`,
      { name, email, password }
    );
  }

  // ─── TOKEN ────────────────────────────────────────────────────────────────
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ─── AUTH STATE ───────────────────────────────────────────────────────────
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
