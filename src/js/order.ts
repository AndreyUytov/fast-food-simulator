export interface IOrder {
  get orderNumber(): number
  set stateOrder(value: Boolean)
}

let orderId = 0

export class Order implements IOrder {
  private orderId: number
  private orderDone: Boolean

  constructor() {
    this.orderId = orderId++
    this.orderDone = false
  }

  set stateOrder(value: Boolean) {
    this.orderDone = value
  }

  get orderNumber() {
    return this.orderId
  }
}
