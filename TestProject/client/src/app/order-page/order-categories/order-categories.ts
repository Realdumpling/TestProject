import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../shared/layouts/services/categories.service';
import { Observable } from 'rxjs';
import { Category } from '../../shared/interfaces';
import { RouterLink } from '@angular/router';
import { Loader } from '../../shared/components/loader/loader';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-categories',
  imports: [Loader, CommonModule, RouterLink],
  templateUrl: './order-categories.html',
  styleUrl: './order-categories.css',
})
export class OrderCategories implements OnInit {

  categories$!: Observable<Category[]>

  constructor(private categoriesService: CategoriesService) {

  }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch();
  }
}
