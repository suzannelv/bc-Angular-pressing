import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  profilImage = 'assets/user-circle.svg';
  quantityInCart: number = 0;

  constructor(
    private cartService: CartService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.updateQuantityInCart();
    this.cartService.cart$.subscribe((products) => {
      this.updateQuantityInCart();
    });
  }

  private updateQuantityInCart(): void {
    this.quantityInCart = this.cartService.getTotalQuantity();
  }

  removeUserInfo() {
    this.tokenService.clearToken();
  }
}
