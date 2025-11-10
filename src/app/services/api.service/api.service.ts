// src/app/services/api.service/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE SALVAR (POST) ---
  salvarSexo(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/sexo/save`, dados); }
  salvarUf(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/uf/save`, dados); }
  salvarBairro(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/bairro/save`, dados); }
  salvarCep(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/cep/save`, dados); }
  salvarRua(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/rua/save`, dados); }
  salvarMarca(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/marca/save`, dados); }
  salvarTipo(dados: any): Observable<any> { return this.http.post(`${this.baseUrl}/tipo/save`, dados); }
  salvarCidade(cidade: any): Observable<any> { return this.http.post(`${this.baseUrl}/cidade/save`, cidade); }
  salvarCliente(cliente: any): Observable<any> { return this.http.post(`${this.baseUrl}/cliente/save`, cliente); }
  salvarProduto(produto: any): Observable<any> { return this.http.post(`${this.baseUrl}/produto/save`, produto); }
  salvarVenda(venda: any): Observable<any> { return this.http.post(`${this.baseUrl}/venda/save`, venda); } // <-- NOVO
  salvarVendaProduto(vp: any): Observable<any> { return this.http.post(`${this.baseUrl}/vendaProduto/save`, vp); } // <-- NOVO

  // --- MÉTODOS DE LISTAGEM (GET) ---
  getClientes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/cliente/list`); }
  getProdutos(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/produto/list`); }
  getVendas(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/venda/list`); }
  getSexos(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/sexo/list`); }
  getCidades(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/cidade/list`); }
  getRuas(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/rua/list`); }
  getBairros(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/bairro/list`); }
  getCeps(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/cep/list`); }
  getMarcas(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/marca/list`); }
  getTipos(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/tipo/list`); }
  getUfs(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/uf/list`); }
  getVendaProdutos(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/vendaProduto/list`); } // <-- NOVO

  // --- MÉTODOS DE ATUALIZAR (PUT) ---
  updateSexo(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/sexo/update/${id}`, dados); }
  updateUf(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/uf/update/${id}`, dados); }
  updateBairro(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/bairro/update/${id}`, dados); }
  updateCep(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/cep/update/${id}`, dados); }
  updateRua(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/rua/update/${id}`, dados); }
  updateMarca(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/marca/update/${id}`, dados); }
  updateTipo(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/tipo/update/${id}`, dados); }
  updateCidade(id: number, dados: any): Observable<any> { return this.http.put(`${this.baseUrl}/cidade/update/${id}`, dados); }
  updateCliente(id: number, cliente: any): Observable<any> { return this.http.put(`${this.baseUrl}/cliente/update/${id}`, cliente); }
  updateProduto(id: number, produto: any): Observable<any> { return this.http.put(`${this.baseUrl}/produto/update/${id}`, produto); }
  updateVenda(id: number, venda: any): Observable<any> { return this.http.put(`${this.baseUrl}/venda/update/${id}`, venda); } // <-- NOVO
  updateVendaProduto(pId: number, vId: number, vp: any): Observable<any> { return this.http.put(`${this.baseUrl}/vendaProduto/update/${pId}/${vId}`, vp); } // <-- NOVO

  // --- MÉTODOS DE EXCLUSÃO (DELETE) ---
  deleteCliente(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/cliente/delete/${id}`); }
  deleteProduto(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/produto/delete/${id}`); }
  deleteSexo(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/sexo/delete/${id}`); }
  deleteUf(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/uf/delete/${id}`); }
  deleteBairro(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/bairro/delete/${id}`); }
  deleteCep(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/cep/delete/${id}`); }
  deleteRua(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/rua/delete/${id}`); }
  deleteMarca(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/marca/delete/${id}`); }
  deleteTipo(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/tipo/delete/${id}`); }
  deleteCidade(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/cidade/delete/${id}`); }
  deleteVenda(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/venda/delete/${id}`); } // <-- NOVO
  deleteVendaProduto(pId: number, vId: number): Observable<any> { return this.http.delete(`${this.baseUrl}/vendaProduto/delete/${pId}/${vId}`); } // <-- NOVO
}
