import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { MaterialService } from '../../services/material.service';
import { ServiceOptionsService } from '../../services/service-options.service';
import { forkJoin, map } from 'rxjs';
import { CartItemViewModel } from '../../model/CartItemViewModel.interface';
import { calculateTotalPrice } from '../../utils/calculTotalPrice';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  items: CartProductSelectedInterface[] = [];
  totalQuantity: number = 0;
  isDelivery: boolean = false;
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // this.getProducts();
    // this.updateTotalQuantity();
    // this.cartService.cart$.subscribe((q) => {
    //   this.updateTotalQuantity();
    // });
    this.cartService.cart$.subscribe((newCart) => {
      console.log('购物车已更新', newCart);
      this.items = newCart;
      this.totalPrice = this.cartService.calculateTotalPrice(newCart);
      this.totalQuantity = this.cartService.getTotalQuantity();
    });
    // 初始加载购物车
    this.loadInitialCart();
  }

  loadInitialCart() {
    this.items = this.cartService.getProducts();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  getProducts() {
    this.items = this.cartService.getProducts();
    // console.log('items', this.items);
    // // 打印每个商品的数量
    // this.items.forEach((item, index) => {
    //   console.log(`Item ${index} quantity:`, item.quantity);
    // });
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
  }

  handlePickupChoice() {
    this.isDelivery = false;
  }

  handleDeliveryChoice() {
    this.isDelivery = true;
  }

  private updateTotalQuantity(): void {
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  decrement(item: CartProductSelectedInterface) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  increment(item: CartProductSelectedInterface) {
    item.quantity++;
  }

  updateCart() {
    this.updateTotalQuantity();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
    this.cartService.getProducts();
  }

  removeItem(uniqueId: string) {
    this.cartService.removeProduct(uniqueId);
    this.getProducts();
  }
}
