import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import {
  CategoryInterface,
  CategoryResponse,
} from '../../model/category.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  parentCategories: CategoryInterface[] | undefined;
  activeTabId: number | undefined;
  activeChildTabId: number | undefined;
  selectedCategoryId: number | undefined;
  isLoading = true;

  constructor(private categoryService: CategoryService) {}

  // ngOnInit(): void {
  //   this.isLoading = true;
  //   this.categoryService
  //     .getParentCategories()
  //     .subscribe((res: CategoryResponse) => {
  //       if (res && res['hydra:member']) {
  //         this.parentCategories = res['hydra:member'].filter(
  //           (category: any) => !category.parent
  //         );

  //         if (this.parentCategories.length > 0) {
  //           this.activeTabId = this.parentCategories[0].id;
  //         }
  //         // console.log(this.parentCategories);
  //         this.parentCategories.forEach((parentCategory: CategoryInterface) => {
  //           // console.log(parentCategory.child);
  //           const childNames: any[] = [];

  //           const childUrls = parentCategory.child;
  //           childUrls?.forEach((url) => {
  //             const parts = url.toString().split('/');
  //             const childId = parts[parts.length - 1];
  //             this.categoryService
  //               .getChildCategory(Number(childId))
  //               .subscribe((childCategory: CategoryInterface) => {
  //                 childNames.push({
  //                   id: childCategory.id,
  //                   name: childCategory.name,
  //                 });
  //               });
  //           });
  //           parentCategory.child = childNames;
  //         });
  //       }
  //     });
  // }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      const res = await firstValueFrom(
        this.categoryService.getParentCategories()
      );
      if (res && res['hydra:member']) {
        this.parentCategories = res['hydra:member'].filter(
          (category: any) => !category.parent
        );

        if (this.parentCategories.length > 0) {
          this.activeTabId = this.parentCategories[0].id;
          await this.selectFirstSubCategoryOfParent(this.parentCategories[0]); // 确保此处等待子类别加载
        }
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
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      this.isLoading = false;
    }
  }

  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    const parentCategory = this.parentCategories?.find(
      (category) => category.id === tabId
    );
    if (parentCategory) {
      this.selectFirstSubCategoryOfParent(parentCategory);
    }
  }

  async selectFirstSubCategoryOfParent(
    parentCategory: CategoryInterface
  ): Promise<void> {
    if (parentCategory.child && parentCategory.child.length > 0) {
      const childIds = parentCategory.child
        .map((url) => {
          const parts = url.toString().split('/');
          const childId = Number(parts[parts.length - 1]);
          return childId;
        })
        .filter((id) => !isNaN(id) && id != null);

      // Récupérer les produits de la première sous-catégorie
      if (childIds.length > 0) {
        const firstChildId = childIds[0];

        console.log('Loading child category for ID:', firstChildId);
        if (firstChildId != null) {
          try {
            const childDetail = await firstValueFrom(
              this.categoryService.getChildCategory(+firstChildId)
            );
            console.log('Loaded child category:', childDetail);
            this.getSubCategory({ id: childDetail.id, name: childDetail.name });
          } catch (error) {
            console.error('Error loading child category details:', error);
          }
        }
      }
    }
  }

  getSubCategory(child: { id: number; name: string }) {
    this.selectedCategoryId = child.id;
    this.activeChildTabId = child.id;
    console.log('category id:', this.selectedCategoryId);
    console.log('tab active:', this.activeTabId);
  }
}
