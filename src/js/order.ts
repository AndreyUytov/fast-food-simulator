interface StateOrder {
  orderDone?: Boolean
  orderAccepted?: Boolean
  orderReady?: Boolean
}

export interface IOrder {
  get orderNumber(): number
  set stateOrder(state: StateOrder)
}

export class Order implements IOrder {
  private orderId: number
  private state: StateOrder
  static orderId: number = 1

  constructor() {
    this.orderId = Order.orderId++
    this.state = {
      orderAccepted: false,
      orderDone: false,
      orderReady: false,
    }
  }

  set stateOrder(state: StateOrder) {
    this.state = { ...this.state, ...state }
  }

  get orderNumber() {
    return this.orderId
  }
}
