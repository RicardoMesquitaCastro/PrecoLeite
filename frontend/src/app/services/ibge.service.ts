import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) {}

  /** ⚡ Lista municípios por UF */
  getMunicipiosPorUF(uf: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/estados/${uf}/municipios`);
  }
}
