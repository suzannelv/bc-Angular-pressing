import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthComponent } from './views/auth/auth.component';
import { CartComponent } from './views/cart/cart.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { CategoryComponent } from './views/category/category.component';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'welcome/:username', component: WelcomeComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.isLoggedIn() || router.parseUrl('/auth');
      },
    ],
  },
  { path: 'cart', component: CartComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
