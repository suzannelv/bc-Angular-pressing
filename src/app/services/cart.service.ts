import { Injectable } from '@angular/core';
import {
  CartProductSelectedInterface,
  CreateProductSelectedInterface,
} from '../model/productSelected.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

const CART_STORAGE_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartProductSelectedInterface[]>(
    this.getProducts()
  );
  cart$ = this.cart.asObservable();

  constructor(private authService: AuthService) {}

  private getCartKey(): string {
    const userId = localStorage.getItem('userId');
    return userId ? `${CART_STORAGE_KEY}_${userId}` : CART_STORAGE_KEY;
  }

  public loadInitialCart(): void {
    const key = this.getCartKey();
    const storedCart = localStorage.getItem(key);
    const cartData = storedCart ? JSON.parse(storedCart) : [];
    this.cart.next(cartData);
  }

  addProduct(product: CreateProductSelectedInterface): void {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex((p) => p.uniqueId === product.uniqueId);

    if (index !== -1) {
      currentCart[index].quantity += product.quantity;
    } else {
      currentCart.push(product);
    }

    this.updateCart(currentCart);
  }

  updateCart(cart: CartProductSelectedInterface[]): void {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
    this.cart.next(cart);
  }

  getProducts(): CartProductSelectedInterface[] {
    // 调用一个新的方法来获取基于当前用户的存储键
    const cartStorageKey = this.getCartKey();
    const cartLocalStorage = localStorage.getItem(cartStorageKey);

    if (cartLocalStorage === null) {
      return [];
    }

    const cart = JSON.parse(cartLocalStorage) as CartProductSelectedInterface[];
    return cart;
  }

  removeProduct(uniqueId: string) {
    let currentCart = this.getProducts();
    const newCart = currentCart.filter((item) => item.uniqueId !== uniqueId);
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(newCart));
    this.cart.next(newCart);
  }

  getTotalQuantity(): number {
    let totalQuantity = 0;
    const currentCart = this.getProducts();
    currentCart.forEach((item) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  }

  calculateTotalPrice(items: CartProductSelectedInterface[]): number {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });
    return parseFloat(total.toFixed(2));
  }
  clearCart() {
    const key = this.getCartKey();
    localStorage.removeItem(key);
    this.cart.next([]);
  }
}
