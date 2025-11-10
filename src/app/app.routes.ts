
import { MenuComponent } from './menu/menu';
import { SexoComponent } from './sexo/sexo';
import { UfComponent } from './uf/uf';
import { BairroComponent } from './bairro/bairro';
import { CepComponent } from './cep/cep';
import { RuaComponent } from './rua/rua';
import { MarcaComponent } from './marca/marca';
import { TipoComponent } from './tipo/tipo';

export const routes = [
  { path: '', component: MenuComponent },
  { path: 'sexo', component: SexoComponent },
  { path: 'uf', component: UfComponent },
  { path: 'bairro', component: BairroComponent },
  { path: 'cep', component: CepComponent },
  { path: 'rua', component: RuaComponent },
  { path: 'marca', component: MarcaComponent },
  { path: 'tipo', component: TipoComponent },

  { path: '**', redirectTo: '' }
];
