import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/layouts/services/auth.service';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit, OnDestroy{
  form!: FormGroup;
  aSub!: Subscription;
  submitted = false;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Заходи');
      }
      else if (params['accessDenitd']) {
        MaterialService.toast('Авторизуйся');
      } else if (params['sessionFailed']) {
        MaterialService.toast('Войдите заного');
        }
    });
  }

  ngOnDestroy() {
    if (this.aSub)
      this.aSub.unsubscribe();
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe({ next: () => { this.router.navigate(['/overview']) }, error: (error: any) => { MaterialService.toast(error.error.message), this.form.enable() } });
  }
}
