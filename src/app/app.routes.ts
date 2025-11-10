// src/app/app.routes
import { Routes } from '@angular/router';

// Páginas Principais
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list';

// Formulários de Adicionar/Editar
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form';

// Formulários Auxiliares
import { SexoComponent } from './sexo/sexo';
import { UfComponent } from './uf/uf';
import { BairroComponent } from './bairro/bairro';
import { CepComponent } from './cep/cep';
import { RuaComponent } from './rua/rua';
import { MarcaComponent } from './marca/marca';
import { TipoComponent } from './tipo/tipo';

export const routes: Routes = [
  // Rotas principais
  { path: 'dashboard', component: DashboardComponent },

  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent }, // <-- ADICIONADA
  // { path: 'clientes/editar/:id', component: ClienteFormComponent }, // Para o futuro

  { path: 'produtos', component: ProdutoListComponent },
  { path: 'produtos/novo', component: ProdutoFormComponent }, // <-- ADICIONADA
  // { path: 'produtos/editar/:id', component: ProdutoFormComponent }, // Para o futuro

  // Rotas de cadastro que você já criou
  { path: 'sexo', component: SexoComponent },
  { path: 'uf', component: UfComponent },
  { path: 'bairro', component: BairroComponent },
  { path: 'cep', component: CepComponent },
  { path: 'rua', component: RuaComponent },
  { path: 'marca', component: MarcaComponent },
  { path: 'tipo', component: TipoComponent },

  // Rota padrão
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Rota curinga
  { path: '**', redirectTo: 'dashboard' }
];
