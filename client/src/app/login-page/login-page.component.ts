import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { UserInterface } from '../shared/types/user.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  authSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeListeners();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  initializeListeners(): void {
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        if (params['registered']) {
          MaterialService.toast(
            'Теперь вы можете зайти в систему, используя свои данные.'
          );
        }

        if (params['accessDenied']) {
          MaterialService.toast('Для начала авторизуйтесь в системе.');
        }

        if (params['sessionFailed']) {
          MaterialService.toast('Сессия истекла, авторизуйтесь в системе.');
        }
      }
    );
  }

  onSubmit(): void {
    this.form.disable();
    if (this.form.invalid) {
      return;
    }

    this.authSubscription = this.auth.login(this.form.value).subscribe(
      () => this.router.navigateByUrl('/overview'),
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
