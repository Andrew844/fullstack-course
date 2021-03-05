import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { CategoryInterface } from '../../shared/types/category.interface';
import { MaterialService } from '../../shared/services/material.service';
import { ResponseMessageInterface } from '../../shared/types/responseMessage.interface';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  @ViewChild('input') inputRef: ElementRef;

  image: File;
  category: CategoryInterface;
  imagePreview;
  isNew = true;
  form: FormGroup;
  categorySubscription: Subscription;
  deleteCategorySubscription: Subscription;
  submitCategorySubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeListeners();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  initializeListeners(): void {
    this.form.disable();
    this.categorySubscription = this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }

          return of(null);
        })
      )
      .subscribe(
        (category: CategoryInterface) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc;
          }
          this.form.enable();
          MaterialService.updateTextFields();
        },
        (err) => MaterialService.toast(err.error.message)
      );
  }

  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(e: any): void {
    const file: File = e.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.form.disable();

    let obs$;

    if (this.isNew) {
      obs$ = this.categoriesService.create(
        this.form.value.name,
        this.image ? this.image : null
      );
    } else {
      obs$ = this.categoriesService.update(
        this.category._id,
        this.form.value.name,
        this.image ? this.image : null
      );
    }

    this.submitCategorySubscription = obs$.subscribe(
      () => {
        this.form.enable();
        MaterialService.toast('Категория сохранена.');

        if (this.isNew) {
          this.image = null;
          this.imagePreview = null;
          this.form.reset();
        }
      },
      (err) => {
        this.form.enable();
        MaterialService.toast(err.error.message);
      }
    );
  }

  onDelete(): void {
    const decision = confirm(
      `Вы уверены, что хотите удалить категорию "${this.category.name}"?`
    );

    if (decision) {
      this.deleteCategorySubscription = this.categoriesService
        .delete(this.category._id)
        .subscribe(
          (msg: ResponseMessageInterface) => {
            MaterialService.toast(msg.message);
          },
          (err) => MaterialService.toast(err.error.message),
          () => this.router.navigateByUrl('/categories')
        );
    }
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
    if (this.submitCategorySubscription) {
      this.submitCategorySubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
  }
}
