export interface IOrder {
  get orderNumber(): number
  set stateOrder(value: Boolean)
}

export class Order implements IOrder {}
