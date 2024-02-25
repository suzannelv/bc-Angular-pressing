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

  constructor(
    private cartService: CartService,
    private serviceOptionsService: ServiceOptionsService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.updateTotalQuantity();
    this.cartService.cart$.subscribe((q) => {
      this.updateTotalQuantity();
    });
  }
  getProducts() {
    this.items = this.cartService.getProducts();
    console.log('items', this.items);
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

  // -----------------------------------------

  // items: CartItemViewModel[] = []; // 可能需要扩展以包含 materialName 和 serviceOptionsNames

  // constructor(
  //   private cartService: CartService,
  //   private materialService: MaterialService,
  //   private serviceOptionsService: ServiceOptionsService
  // ) {}

  // ngOnInit(): void {
  //   this.getProducts();
  // }

  // getProducts() {
  //   forkJoin({
  //     cartItems: this.cartService.cart$,
  //     materials: this.materialService.getMaterialOptions(),
  //     serviceOptions: this.serviceOptionsService.getServiceOptions(),
  //   })
  //     .pipe(
  //       map(({ cartItems, materials, serviceOptions }) => {
  //         return cartItems.map((item) => {
  //           // 找到每个项目的材料和服务选项的名称
  //           const materialName =
  //             materials['hydra:member'].find(
  //               (material) => material['@id'] === item.material
  //             )?.name || 'Matière inconnue';
  //           const serviceOptionsNames = item.serviceOptions
  //             .map(
  //               (soUri) =>
  //                 serviceOptions['hydra:member'].find(
  //                   (option) => option['@id'] === soUri
  //                 )?.name
  //             )
  //             .filter((name) => !!name) as string[]; // 过滤掉未找到的项

  //           console.log('Mapped item with details:', item);
  //           return { ...item, materialName, serviceOptionsNames };
  //         });
  //       })
  //     )
  //     .subscribe((itemsWithDetails) => {
  //       console.log('Items with details:', itemsWithDetails);
  //       this.items = itemsWithDetails;
  //       console.log('items with details', this.items);
  //     });
  // }
}
