import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import {
  CategoryInterface,
  CategoryResponse,
} from '../../model/category.interface';
import { ProductInterface } from '../../model/product.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  parentCategories: CategoryInterface[] | undefined;
  activeTabId: number | undefined;
  selectedCategoryId: number | undefined;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService
      .getParentCategories()
      .subscribe((res: CategoryResponse) => {
        if (res && res['hydra:member']) {
          this.parentCategories = res['hydra:member'].filter(
            (category: any) => !category.parent
          );

          if (this.parentCategories.length > 0) {
            this.activeTabId = this.parentCategories[0].id;
          }
          // console.log(this.parentCategories);
          this.parentCategories.forEach((parentCategory: CategoryInterface) => {
            // console.log(parentCategory.child);
            const childNames: any[] = [];

            const childUrls = parentCategory.child;
            childUrls?.forEach((url) => {
              const parts = url.toString().split('/');
              const childId = parts[parts.length - 1];
              this.categoryService
                .getChildCategory(Number(childId))
                .subscribe((childCategory: CategoryInterface) => {
                  childNames.push({
                    id: childCategory.id,
                    name: childCategory.name,
                  });
                });
            });
            parentCategory.child = childNames;
          });
        }
      });
  }

  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
  }

  getSubCategory(child: { id: number; name: string }) {
    this.selectedCategoryId = child.id;
    console.log(this.selectedCategoryId);
  }
}
