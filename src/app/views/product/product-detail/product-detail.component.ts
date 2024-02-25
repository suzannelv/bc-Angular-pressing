import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../model/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ServiceOptionsService } from '../../../services/service-options.service';
import { ServiceOptionsInterface } from '../../../model/serviceOptions.interface';
import { MaterialService } from '../../../services/material.service';
import { MaterialsInterface } from '../../../model/materials.interface';
import { ProductSelectedService } from '../../../services/product-selected.service';
import {
  CreateProductSelectedInterface,
  ProductSelectedInterface,
} from '../../../model/productSelected.interface';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  productSelected: ProductInterface | undefined;
  options: ServiceOptionsInterface[] | undefined;
  materials: MaterialsInterface[] | undefined;
  selectedMaterial: string | undefined;
  quantity: number = 1;
  price: number = 0;

  selectedOptions: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private optionsService: ServiceOptionsService,
    private materialService: MaterialService,
    private productSelectedService: ProductSelectedService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService
        .getProductById(Number(productId))
        .subscribe((product) => {
          this.productSelected = product;
          console.log('Produit sélectionné: ', this.productSelected);
        });
      this.getOptions();
      this.getMaterials();
      this.getProductSelected(+productId);
    }
  }

  getOptions() {
    this.optionsService.getServiceOptions().subscribe((res) => {
      this.options = res['hydra:member'];
      console.log(this.options);
      this.options.forEach((option) => {
        this.selectedOptions[option['@id']] = false;
      });
    });
  }

  getMaterials() {
    this.materialService.getMaterialOptions().subscribe((res) => {
      this.materials = res['hydra:member'];
      if (this.materials && this.materials.length > 0) {
        this.selectedMaterial = this.materials[0]['@id'];
      }
    });
  }

  onMaterialChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMaterial = selectElement.value;
  }

  getProductSelected(productId: number) {
    this.productSelectedService.getProductSelectedAll().subscribe((res) => {
      const data = res['hydra:member'];
      data.filter(
        (productSelected) => productId === productSelected.product.id
      );
      console.log(data);
    });
  }

  incrementQuantity() {
    this.quantity++;
  }
  decrementQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  onSubmit() {
    const selectedServiceOptions = Object.keys(this.selectedOptions).filter(
      (key: any) => this.selectedOptions[key]
    );
    const productSelect: CreateProductSelectedInterface = {
      product: this.productSelected!['@id'],
      productName: this.productSelected!.name,
      material: this.selectedMaterial!,
      serviceOptions: selectedServiceOptions,
      quantity: this.quantity,
      price: this.productSelected!.price,
      imagePath: this.productSelected!.imagePath,
    };

    console.log('Adding to cart:', productSelect);

    this.cartService.addProduct(productSelect);
  }

  handleOptionChange(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    const optionIri = checkbox.value;
    this.selectedOptions[optionIri] = checkbox.checked;
    console.log(`Option ${optionIri} changed: ${checkbox.checked}`);
  }
}
