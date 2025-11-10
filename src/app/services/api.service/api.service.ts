// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE CADASTRO AUXILIARES ---
  salvarSexo(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sexo/save`, dados);
  }
  salvarUf(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/uf/save`, dados);
  }
  salvarBairro(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bairro/save`, dados);
  }
  salvarCep(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cep/save`, dados);
  }
  salvarRua(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rua/save`, dados);
  }
  salvarMarca(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/marca/save`, dados);
  }
  salvarTipo(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tipo/save`, dados);
  }

  // --- MÉTODOS DE LISTAGEM (GET) ---
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cliente/list`);
  }
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produto/list`);
  }
  getVendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/venda/list`);
  }

  // --- Dropdowns Cliente Form ---
  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sexo/list`);
  }
  getCidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cidade/list`);
  }
  getRuas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rua/list`);
  }
  getBairros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bairro/list`);
  }
  getCeps(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cep/list`);
  }

  // --- Dropdowns Produto Form ---
  getMarcas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/marca/list`);
  }
  getTipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tipo/list`);
  }

  // --- MÉTODOS DE SALVAR (POST) ---
  salvarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cliente/save`, cliente);
  }
  salvarProduto(produto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/produto/save`, produto);
  }

  // --- MÉTODOS DE EXCLUSÃO (DELETE) ---
  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cliente/delete/${id}`);
  }
  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/produto/delete/${id}`);
  }
}
