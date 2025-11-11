import { Routes } from '@angular/router';

// Páginas Principais
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list';

// Formulários de Adicionar/Editar
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form';

// Componente de Venda (Novo)
import { VendaComponent } from './pages/venda/venda';

// Formulários/CRUDs Auxiliares
import { SexoComponent } from './pages/sexo/sexo';
import { UfComponent } from './pages/uf/uf';
import { BairroComponent } from './pages/bairro/bairro';
import { CepComponent } from './pages/cep/cep';
import { RuaComponent } from './pages/rua/rua';
import { MarcaComponent } from './pages/marca/marca';
import { TipoComponent } from './pages/tipo/tipo';
import { CidadeComponent } from './pages/cidade/cidade';

export const routes: Routes = [
  // Rotas principais
  { path: 'dashboard', component: DashboardComponent },

  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },

  { path: 'produtos', component: ProdutoListComponent },
  { path: 'produtos/novo', component: ProdutoFormComponent },
  { path: 'produtos/editar/:id', component: ProdutoFormComponent },

  { path: 'vendas', component: VendaComponent },

  // Rotas de cadastro
  { path: 'sexo', component: SexoComponent },
  { path: 'uf', component: UfComponent },
  { path: 'cidade', component: CidadeComponent },
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
