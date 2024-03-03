import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { PaymentService } from '../../services/payment.service';
import { PaymentInterface } from '../../model/payment.interface';
import { ClickCollectFormComponent } from '../../components/click-collect-form/click-collect-form.component';
import { DeliveryFormComponent } from '../../components/delivery-form/delivery-form.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  @ViewChild(ClickCollectFormComponent)
  clickCollectFormComponent?: ClickCollectFormComponent;
  @ViewChild(DeliveryFormComponent)
  deliveryFormComponent?: DeliveryFormComponent;

  items: CartProductSelectedInterface[] = [];
  totalQuantity: number = 0;
  isDelivery: boolean = false;
  totalPrice: number = 0;
  paymentsOptions: PaymentInterface[] = [];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((newCart) => {
      console.log('购物车已更新', newCart);
      this.items = newCart;
      this.totalPrice = this.cartService.calculateTotalPrice(newCart);
      this.totalQuantity = this.cartService.getTotalQuantity();
    });
    // 初始加载购物车
    this.loadInitialCart();
    this.getPayments();
  }

  loadInitialCart() {
    this.items = this.cartService.getProducts();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  getProducts() {
    this.items = this.cartService.getProducts();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
  }
  getPayments() {
    this.paymentService.getPaymentMethods().subscribe((res) => {
      this.paymentsOptions = res['hydra:member'];
      console.log(this.paymentsOptions);
    });
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

  submitForms() {
    let formData;
    if (this.isDelivery) {
      formData = this.deliveryFormComponent?.submitForm();
    } else {
      formData = this.clickCollectFormComponent?.submitForm();
    }
    if (formData) {
      console.log('子表单数据：', formData);
    } else {
      console.log('表单验证失败，没有数据返回。');
    }
  }
}
