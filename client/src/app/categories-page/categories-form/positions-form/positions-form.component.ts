import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PositionsService } from '../../../shared/services/positions.service';
import { Subscription } from 'rxjs';
import { PositionInterface } from '../../../shared/types/position.interface';
import { MaterialService } from '../../../shared/services/material.service';
import { InitModalInterface } from '../../../shared/types/initModal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseMessageInterface } from '../../../shared/types/responseMessage.interface';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input('categoryId') categoryIdProps;
  @ViewChild('modal') modalRef: ElementRef;

  fetchPositionsSubscription: Subscription;
  createPositionsSubscription: Subscription;
  updatePositionsSubscription: Subscription;
  deletePositionsSubscription: Subscription;
  positions: PositionInterface[] = [];
  isLoading = false;
  modal: InitModalInterface;
  form: FormGroup;
  positionId = null;

  constructor(
    private positionsService: PositionsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.isLoading = true;
    this.fetchPositionsSubscription = this.positionsService
      .fetch(this.categoryIdProps)
      .subscribe(
        (positions: PositionInterface[]) => {
          this.positions = positions;
        },
        (err) => MaterialService.toast(err.errors.message),
        () => (this.isLoading = false)
      );
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      cost: [null, Validators.required],
    });
  }

  onSelectPosition(position: PositionInterface): void {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    this.modal.open();
    MaterialService.updateTextFields();
  }

  onAddPosition(): void {
    this.positionId = null;
    this.form.patchValue({
      name: null,
      cost: 1,
    });
    MaterialService.updateTextFields();
    this.modal.open();
  }

  onCloseModal(): void {
    this.modal.close();
  }

  onSubmit(): void {
    const submit = this;
    this.form.disable();

    const newPosition: PositionInterface = {
      ...this.form.value,
      category: this.categoryIdProps,
    };

    function completed() {
      submit.form.enable();
      submit.form.reset();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.updatePositionsSubscription = this.positionsService
        .update(newPosition)
        .subscribe(
          (position: PositionInterface) => {
            const posIdx = this.positions.findIndex(
              (p) => p._id === position._id
            );

            this.positions[posIdx] = position;

            MaterialService.toast('Позиция изменена');
            this.modal.close();
          },
          (err) => MaterialService.toast(err.error.message),
          completed
        );
      return;
    }

    this.createPositionsSubscription = this.positionsService
      .create(newPosition)
      .subscribe(
        (position: PositionInterface) => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
          this.modal.close();
        },
        (err) => MaterialService.toast(err.error.message),
        completed
      );
  }

  onDeletePosition(e: Event, position: PositionInterface): void {
    e.stopPropagation();
    const decision = confirm(
      `Вы действительно хотите удалить "${position.name}"?`
    );

    if (decision) {
      this.deletePositionsSubscription = this.positionsService
        .delete(position._id)
        .subscribe(
          (res: ResponseMessageInterface) => {
            const idx = this.positions.findIndex((p) => p._id === position._id);
            this.positions.splice(idx, 1);
            MaterialService.toast(res.message);
          },
          (err) => MaterialService.toast(err.error.message)
        );
    }
  }

  ngOnDestroy(): void {
    this.fetchPositionsSubscription.unsubscribe();
    this.modal.destroy();

    if (this.createPositionsSubscription) {
      this.createPositionsSubscription.unsubscribe();
    }

    if (this.updatePositionsSubscription) {
      this.updatePositionsSubscription.unsubscribe();
    }

    if (this.deletePositionsSubscription) {
      this.deletePositionsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }
}
