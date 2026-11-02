import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PositionsForm } from './positions-form/positions-form';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CategoriesService } from '../../shared/layouts/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [PositionsForm, ReactiveFormsModule, CommonModule],
  templateUrl: './categories-form.html',
  styleUrl: './categories-form.css',
})
export class CategoriesForm implements OnInit {

  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  image!: File;
  imagePreview: string | null = null;
  isNew = true;
  category!: Category;
  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService, private router: Router) {

  }

  ngOnInit() {

    this.form = new FormGroup({name: new FormControl(null, [Validators.required])})

    this.form.disable();

    this.route.params.pipe(switchMap((params: Params) => {
      if (params['id']) {
        this.isNew = false;
        return this.categoriesService.getById(params['id']);
      }

      return of(null);

    })).subscribe({ next: (category: Category | null) => { if (category) { this.category = category; this.form.patchValue({ name: category.name }) } this.form.enable(); this.imagePreview = category?.imageSrc != undefined ? category?.imageSrc : ''; }, error: (error: any) => { MaterialService.toast(error.error?.message) } })

  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  deleteCategory() {
    const decision = window.confirm(`Убрать категорию"${this.category.name}"?`);

    if (decision) {
      this.categoriesService.delete(this.category._id != undefined ? this.category._id : '').subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
      );
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') 
        this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    this.isNew ? obs$ = this.categoriesService.create(this.form.value.name, this.image) : obs$ = this.categoriesService.update(this.category._id != undefined ? this.category._id : '', this.form.value.name, this.image)
    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast("Изменения сохранены");
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }



}
