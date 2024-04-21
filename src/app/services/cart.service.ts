import { Injectable } from '@angular/core';
import {
  CartProductSelectedInterface,
  CreateProductSelectedInterface,
} from '../model/productSelected.interface';
import { BehaviorSubject } from 'rxjs';

const CART_STORAGE_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartProductSelectedInterface[]>(
    this.getProducts()
  );
  cart$ = this.cart.asObservable();

  constructor() {}

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

  /**
   * Récupère les produits du panier stockés dans localStorage pour l'utilisateur actuel.
   * @returns Un tableau de produits sélectionnés dans le panier. Retourne un tableau vide si aucun produit n'est stocké.
   */
  getProducts(): CartProductSelectedInterface[] {
    const cartStorageKey = this.getCartKey();
    const cartLocalStorage = localStorage.getItem(cartStorageKey);

    if (cartLocalStorage === null) {
      return [];
    }

    const cart = JSON.parse(cartLocalStorage) as CartProductSelectedInterface[];
    return cart;
  }

  /**
   * Supprime un produit du panier en fonction de son identifiant unique.
   * @param uniqueId L'identifiant unique du produit à supprimer.
   */
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

  increment(item: CartProductSelectedInterface): void {
    let currentCart = this.getProducts();
    const index = currentCart.findIndex((p) => p.uniqueId === item.uniqueId);
    if (index !== -1) {
      currentCart[index].quantity++;
      // mise à jour la quantité des produis dans le panier
      this.updateCart(currentCart);
    }
  }

  decrement(item: CartProductSelectedInterface): void {
    let currentCart = this.getProducts();
    const index = currentCart.findIndex((p) => p.uniqueId === item.uniqueId);
    if (index !== -1 && currentCart[index].quantity > 1) {
      currentCart[index].quantity--;
      // mise à jour la quantité des produis dans le panier
      this.updateCart(currentCart);
    }
  }
}
