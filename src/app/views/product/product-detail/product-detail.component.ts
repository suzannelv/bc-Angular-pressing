import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../model/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ServiceOptionsService } from '../../../services/service-options.service';
import { ServiceOptionsInterface } from '../../../model/serviceOptions.interface';
import { MaterialService } from '../../../services/material.service';
import { MaterialsInterface } from '../../../model/materials.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: ProductInterface | undefined;
  options: ServiceOptionsInterface[] | undefined;
  materials: MaterialsInterface[] | undefined;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private optionsService: ServiceOptionsService,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService
        .getProductById(Number(productId))
        .subscribe((product) => {
          this.product = product;
          console.log(this.product);
        });
      this.getOptions();
      this.getMaterials();
    }
  }

  getOptions() {
    this.optionsService.getServiceOptions().subscribe((res) => {
      this.options = res['hydra:member'];
      console.log(this.options);
    });
  }

  getMaterials() {
    this.materialService.getMaterialOptions().subscribe((res) => {
      this.materials = res['hydra:member'];
      console.log(this.materials);
    });
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
