import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductFormComponent } from './components/product-form/product-form.component';


const routes: Routes = [
 { path: '',component: HomeComponent },
 { path: 'create',component: ProductFormComponent },
 { path: 'product/:id',component: ProductFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
