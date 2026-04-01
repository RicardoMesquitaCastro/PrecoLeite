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
    private userKey = 'auth-user';


  constructor(private http: HttpClient, private router: Router) {}

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  // O backend usa Basic Auth (email:senha) + master token como query param
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
  localStorage.setItem('auth-user', JSON.stringify(res.user)); // ← adiciona
}));
  }

  // ─── REGISTRO ─────────────────────────────────────────────────────────────
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.usersUrl}?access_token=${environment.MASTER_KEY}`,
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

  // ─── ROLE ─────────────────────────────────────────────────────────────────
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
  const user = localStorage.getItem('auth-user');
  if (!user) return null;
  try {
    return JSON.parse(user).role;
  } catch {
    return null;
  }
}

isAdmin(): boolean {
  return this.getRole() === 'admin';
}

  // ─── AUTH STATE ───────────────────────────────────────────────────────────
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }


}
