import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../model/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ServiceOptionsService } from '../../../services/service-options.service';
import { ServiceOptionsInterface } from '../../../model/serviceOptions.interface';
import { MaterialService } from '../../../services/material.service';
import { MaterialsInterface } from '../../../model/materials.interface';
import { ProductSelectedService } from '../../../services/product-selected.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  productSelected: ProductInterface | undefined;
  options: ServiceOptionsInterface[] | undefined;
  materials: MaterialsInterface[] | undefined;
  selectedMaterial: number | undefined;
  quantity: number = 1;
  selectedOptions: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private optionsService: ServiceOptionsService,
    private materialService: MaterialService,
    private productSelectedService: ProductSelectedService
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
        this.selectedOptions[option.id] = false;
      });
    });
  }

  getMaterials() {
    this.materialService.getMaterialOptions().subscribe((res) => {
      this.materials = res['hydra:member'];
      if (this.materials && this.materials.length > 0) {
        this.selectedMaterial = this.materials[0].id;
      }
    });
  }

  onMaterialChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMaterial = Number(selectElement.value);
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
    console.log('Selected options before filtering:', this.selectedOptions);
    const selectedServiceOptions = Object.keys(this.selectedOptions)
      .filter((key: any) => this.selectedOptions[key])
      .map((id) => Number(id));
    console.log(
      'Adding to cart:',
      this.productSelected,
      this.quantity,
      this.selectedMaterial,
      selectedServiceOptions
    );
  }

  handleOptionChange(isChecked: boolean, optionId: number): void {
    this.selectedOptions[optionId] = isChecked;
    console.log(`Option ${optionId} changed: ${isChecked}`);
  }
}
