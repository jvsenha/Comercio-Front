import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  constructor(private http: HttpClient) {}

  salvarSexo(dados: any) {
    return this.http.post('http://localhost:8080/sexo/save', dados);
  }

  salvarUf(dados: any) {
    return this.http.post('http://localhost:8080/uf/save', dados);
  }

  
  salvarBairro(dados: any) {
    return this.http.post('http://localhost:8080/bairro/save', dados);
  }

  
  salvarCep(dados: any) {
    return this.http.post('http://localhost:8080/cep/save', dados);
  }

  
  salvarRua(dados: any) {
    return this.http.post('http://localhost:8080/rua/save', dados);
  }

  
  salvarMarca(dados: any) {
    return this.http.post('http://localhost:8080/marca/save', dados);
  }

  
  salvarTipo(dados: any) {
    return this.http.post('http://localhost:8080/tipo/save', dados);
  }
}
