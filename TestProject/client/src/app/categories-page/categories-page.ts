import { Component, OnInit} from '@angular/core';
import { CategoriesService } from '../shared/layouts/services/categories.service';
import { Loader } from '../shared/components/loader/loader';
import { Category } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [Loader, CommonModule, RouterLink],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage {

  categories$!: Observable<Category[]>; 

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.categories$ =  this.categoriesService.fetch()
  }



}
