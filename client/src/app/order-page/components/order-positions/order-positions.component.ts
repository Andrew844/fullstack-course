import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from '../../../shared/services/positions.service';
import { Observable } from 'rxjs';
import { PositionInterface } from '../../../shared/types/position.interface';
import { map, switchMap } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { MaterialService } from '../../../shared/services/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss'],
  providers: [PositionsService],
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<PositionInterface[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  addToOrder(position: PositionInterface): void {
    MaterialService.toast(`Добавлено: ${position.name} х${position.quantity}`);
    this.orderService.add(position);
  }

  initializeValues(): void {
    this.positions$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.positionsService.fetch(params['id']);
      }),
      map((positions: PositionInterface[]) => {
        return positions.map((pos) => {
          pos.quantity = 1;
          return pos;
        });
      })
    );
  }
}
