// src/app/cep/cep.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from '../cadastro';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask'; // <-- 1. Importe aqui

@Component({
  selector: 'app-cep',
  templateUrl: './cep.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxMaskDirective // <-- 2. Adicione aqui
  ],
  styleUrls: ['./cep.scss']
})
export class CepComponent {
  // ... (seu código aqui se mantém o mesmo) ...
  numeroCep = '';
  salvando = false;
  mensagem = '';
  erro = '';

  constructor(private cadastroService: CadastroService, private router: Router) { }

  // ... (seu método salvar() e voltar() se mantêm os mesmos) ...
  salvar() {
    if (this.numeroCep.trim() === '') {
      this.erro = 'Número CEP é obrigatório';
      return;
    }
    // A máscara já garante 8 dígitos, mas uma checagem extra é boa
    if (this.numeroCep.replace(/\D/g, '').length !== 8) {
      this.erro = 'CEP deve ter 8 números';
      return;
    }
    this.salvando = true;
    this.erro = '';

    // Enviamos para o backend SÓ os números
    const dados = { numeroCep: this.numeroCep.replace(/\D/g, '') };

    this.cadastroService.salvarCep(dados).subscribe({
      next: (resposta) => {
        this.salvando = false;
        this.mensagem = 'Salvo com sucesso!';
        this.numeroCep = '';
        setTimeout(() => { this.mensagem = ''; }, 3000);
      },
      error: (erro) => {
        this.salvando = false;
        this.erro = 'Erro ao salvar. Tente novamente.';
        console.log(erro);
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
