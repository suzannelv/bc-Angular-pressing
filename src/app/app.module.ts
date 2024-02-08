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
import { ServiceListComponent } from './views/service-list/service-list.component';
import { CommitmentComponent } from './views/home/commitment/commitment.component';
import { PresentationComponent } from './views/home/presentation/presentation.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { CarouselComponent } from './views/home/carousel/carousel.component';
import { ChoosingUsComponent } from './views/home/choosing-us/choosing-us.component';
import { FoundersComponent } from './views/home/founders/founders.component';
import { NewsComponent } from './views/home/news/news.component';

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
    ServiceListComponent,
    CommitmentComponent,
    PresentationComponent,
    RegistrationComponent,
    CarouselComponent,
    ChoosingUsComponent,
    FoundersComponent,
    NewsComponent,
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
