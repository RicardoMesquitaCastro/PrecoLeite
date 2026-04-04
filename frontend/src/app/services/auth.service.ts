import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl  = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;
  private tokenKey = 'auth-token';
  private userKey  = 'auth-user';
  private roleKey  = 'role';

  constructor(private http: HttpClient, private router: Router) {}

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  login(email: string, password: string): Observable<{ token: string; user: any }> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${email}:${password}`)
    });

    return this.http
      .post<{ token: string; user: any }>(
        `${this.authUrl}?access_token=${environment.MASTER_KEY}`,
        {},
        { headers }
      )
      .pipe(tap(res => {
        this.saveToken(res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        // NÃO sobrescreve role aqui — preserva o tipoConta salvo no cadastro
      }));
  }

  // ─── REGISTRO ─────────────────────────────────────────────────────────────
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.usersUrl}?access_token=${environment.MASTER_KEY}`,
      { name, email, password }
    );
  }

  // ─── ROLE ─────────────────────────────────────────────────────────────────
  saveRole(tipoConta: string): void {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      user.role = tipoConta;
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch {}
  }

  getRole(): string | null {
    const raw = localStorage.getItem(this.userKey);
    try {
      return raw ? JSON.parse(raw).role : null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';      // ✅ era 'role', corrigido para 'admin'
  }

  isProdutor(): boolean {
    return this.getRole() === 'produtor';
  }

  isVisitante(): boolean {
    return this.getRole() === 'visitante';
  }

  // ─── TOKEN ────────────────────────────────────────────────────────────────
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ─── USER ─────────────────────────────────────────────────────────────────
  getUser(): any {
    const raw = localStorage.getItem(this.userKey);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ─── AUTH STATE ───────────────────────────────────────────────────────────
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }
}
