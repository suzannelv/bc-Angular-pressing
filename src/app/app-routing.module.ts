import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthComponent } from './views/auth/auth.component';
import { CartComponent } from './views/cart/cart.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { CategoryComponent } from './views/category/category.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
