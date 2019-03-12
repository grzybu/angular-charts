import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainComponent } from './exchange/main/main.component';
import { CurrenciesResolverService } from './exchange/resolver.service';
import {HomeComponent} from './home/home.component';

const routes = [
  {
    path: '',
    component: HomeComponent,
    useAsDefault: true,
  },
  {
    path: 'exchange',
    component: MainComponent,
    resolve: {
      currencies: CurrenciesResolverService,
    },
    useAsDefault: false
  },
];

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forRoot(routes,
      {
        preloadingStrategy: PreloadAllModules
      }),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
