import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { BlogComponent } from './views/blog/blog.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './views/home/header/header.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { CartComponent } from './views/cart/cart.component';
import { AuthComponent } from './views/auth/auth.component';

import { CommitmentComponent } from './views/home/commitment/commitment.component';
import { PresentationComponent } from './views/home/presentation/presentation.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { ChoosingUsComponent } from './views/home/choosing-us/choosing-us.component';
import { FoundersComponent } from './views/home/founders/founders.component';
import { NewsComponent } from './views/home/news/news.component';
import { PrestationsComponent } from './views/home/prestations/prestations.component';
import { CategoryComponent } from './views/category/category.component';
import { ProductComponent } from './views/product/product.component';
import { LoadSpinnerComponent } from './components/load-spinner/load-spinner.component';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { ClickCollectFormComponent } from './components/click-collect-form/click-collect-form.component';
import { DeliveryFormComponent } from './components/delivery-form/delivery-form.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { ContactComponent } from './views/contact/contact.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    BlogComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    CartComponent,
    AuthComponent,

    CommitmentComponent,
    PresentationComponent,
    RegistrationComponent,
    ChoosingUsComponent,
    FoundersComponent,
    NewsComponent,
    PrestationsComponent,
    CategoryComponent,
    ProductComponent,
    LoadSpinnerComponent,
    ProductDetailComponent,
    WelcomeComponent,
    ClickCollectFormComponent,
    DeliveryFormComponent,
    UserProfileComponent,
    ContactComponent,
    BackToTopComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
