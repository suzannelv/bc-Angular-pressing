import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  profilImage = 'assets/user-circle.svg';
  quantityInCart: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Souscription à l'observable indiquant l'état de connexion.
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.cartService.loadInitialCart();
        this.cdr.detectChanges();
      }
    });
    // Souscription à l'observable du panier pour mettre à jour la quantité d'articles.
    this.cartService.cart$.subscribe(() => {
      this.updateQuantityInCart();
      // Déclenchement manuel de la détection de changements.
      this.cdr.detectChanges();
    });
  }

  private updateQuantityInCart(): void {
    this.quantityInCart = this.cartService.getTotalQuantity();
  }
  // Déconnexion de l'utilisateur et suppression des informations utilisateur.
  removeUserInfo() {
    this.authService.logout();
  }
}
