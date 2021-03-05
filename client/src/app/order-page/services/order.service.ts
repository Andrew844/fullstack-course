import { Injectable } from '@angular/core';
import { PositionInterface } from '../../shared/types/position.interface';
import { OrderPositionInterface } from '../../shared/types/orderPosition.interface';

@Injectable()
export class OrderService {
  public list: OrderPositionInterface[] = [];
  public price = 0;

  add(position: PositionInterface): void {
    const orderPosition: OrderPositionInterface = Object.assign(
      {},
      {
        name: position.name,
        cost: position.cost,
        quantity: position.quantity,
        _id: position._id,
      }
    );

    const pos = this.list.find(
      (pos: OrderPositionInterface) => pos._id === orderPosition._id
    );

    if (pos) {
      pos.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  remove(orderPosition: OrderPositionInterface): void {
    const idx = this.list.findIndex((o) => o._id === orderPosition._id);
    this.list.splice(idx, 1);
    this.computePrice();
  }

  computePrice(): void {
    this.price = this.list.reduce((total, item) => {
      total += item.quantity * item.cost;
      return total;
    }, 0);
  }

  clear(): void {
    this.list = [];
    this.price = 0;
  }
}
