import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../shared/services/categories.service';
import { Observable, Subscription } from 'rxjs';
import { CategoryInterface } from '../../../shared/types/category.interface';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss'],
})
export class OrderCategoriesComponent implements OnInit {
  categories$: Observable<CategoryInterface[]>;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.categories$ = this.categoriesService.fetch();
  }
}
