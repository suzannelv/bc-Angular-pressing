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
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.updateQuantityInCart();
    this.cartService.cart$.subscribe((products) => {
      this.updateQuantityInCart();
      this.cdr.detectChanges();
    });
  }

  private updateQuantityInCart(): void {
    this.quantityInCart = this.cartService.getTotalQuantity();
  }

  removeUserInfo() {
    this.authService.logout();
  }
}
