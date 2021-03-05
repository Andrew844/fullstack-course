import { OrderPositionInterface } from './orderPosition.interface';

export interface OrderInterface {
  date?: Date;
  order?: number;
  user?: string;
  list: OrderPositionInterface[];
  _id?: string;
}
