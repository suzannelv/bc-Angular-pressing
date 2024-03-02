import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../model/product.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ServiceOptionsService } from '../../../services/service-options.service';
import {
  OptionsResponse,
  ServiceOptionsInterface,
} from '../../../model/serviceOptions.interface';
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
  selectedMaterialCoeff: number = 1;
  selectedServiceCoeff: number = 1;

  selectedOptions: { [key: string]: boolean } = {};
  selectedServiceOptionsCoefficients: { [key: string]: number } = {};

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
    this.optionsService
      .getServiceOptions()
      .subscribe((res: ServiceOptionsInterface[]) => {
        this.options = res;
        console.log('options :', this.options);
        this.options?.forEach((option) => {
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

    // 找到选中材质的系数并更新 selectedMaterialCoeff
    const selectedMaterialObj = this.materials?.find(
      (material) => material['@id'] === this.selectedMaterial
    );
    if (selectedMaterialObj) {
      this.selectedMaterialCoeff = selectedMaterialObj.coefficentPrice;
    }
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

  handleOptionChange(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    // const optionIri = checkbox.value;
    // this.selectedOptions[optionIri] = checkbox.checked;
    // 当选项被选中时，找到该选项的系数并存储

    const optionId = checkbox.value;
    this.selectedOptions[optionId] = checkbox.checked;
    if (checkbox.checked) {
      const option = this.options?.find((o) => o['@id'] === optionId);
      if (option) {
        this.selectedServiceOptionsCoefficients[optionId] =
          option.coefficentPrice;
      }
    } else {
      // 当选项被取消选中时，从存储中移除该选项的系数
      delete this.selectedServiceOptionsCoefficients[optionId];
    }

    console.log(`Option ${optionId} changed: ${checkbox.checked}`);
    console.log(
      'Selected Service Options Coefficients:',
      this.selectedServiceOptionsCoefficients
    );
  }

  // calcul the total price of one item
  calculateItemTotalPrice(): number {
    const basePrice = this.productSelected?.price || 0;
    const servicePriceIncrease = Object.values(
      this.selectedServiceOptionsCoefficients
    ).reduce((acc, coeff) => acc + coeff, 0);
    const materialPriceIncrease = this.selectedMaterialCoeff;
    const totalPrice =
      basePrice * (1 + servicePriceIncrease + materialPriceIncrease);
    return totalPrice * this.quantity;
  }

  onSubmit() {
    // 为商品/选项/材料组合生成一个唯一标识符
    const uniqueId = `${this.productSelected!['@id']}-${Object.keys(
      this.selectedOptions
    )
      .filter((key) => this.selectedOptions[key])
      .join('-')}-${this.selectedMaterial}`;

    const serviceCoefficientsArray: number[] = Object.values(
      this.selectedServiceOptionsCoefficients
    );

    const selectedServiceOptions = Object.keys(this.selectedOptions).filter(
      (key: any) => this.selectedOptions[key]
    );

    const productSelect: CreateProductSelectedInterface = {
      uniqueId,
      product: this.productSelected!['@id'],
      productName: this.productSelected!.name,
      material: this.selectedMaterial!,
      materialCoefficent: this.selectedMaterialCoeff,
      serviceOptions: selectedServiceOptions,
      serviceCoefficent: serviceCoefficientsArray,
      quantity: this.quantity,
      price: this.calculateItemTotalPrice(),
      imagePath: this.productSelected!.imagePath,
    };

    console.log('Adding to cart:', productSelect);

    this.cartService.addProduct(productSelect);
  }
}
