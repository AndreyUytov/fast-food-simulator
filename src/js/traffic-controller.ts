import { IOrder, Order } from './order'

export interface TrafficController {
  addToQueue(order: IOrder): void
  get orderQueueLength(): number
  get orderQueueList(): IOrder[]
  get currentOrder(): IOrder
  set durationOfOrderInMs(ms: number)
  makeOrder(): any
}

export class TrafficControll implements TrafficController {
  private orderQueue: IOrder[] = []
  private durationOfOrder: number
  private order: IOrder

  constructor() {
    this.getNextOrder = this.getNextOrder.bind(this)
  }

  addToQueue(order: IOrder) {
    this.orderQueue.push(order)
  }

  get orderQueueLength() {
    return this.orderQueue.length
  }

  get orderQueueList() {
    return this.orderQueue
  }

  get currentOrder() {
    return this.order
  }

  getNextOrder() {
    return (this.order = this.orderQueue.shift())
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  [Symbol.asyncIterator]() {
    return {
      durationOfOrder: this.durationOfOrder,
      getNextOrder: this.getNextOrder,

      async next() {
        let current = this.getNextOrder()

        await new Promise((res) => setTimeout(res, this.durationOfOrder))

        if (current) {
          return { done: false, value: current }
        } else {
          return { done: true }
        }
      },
    }
  }

  async makeOrder() {
    for await (let value of this) {
      console.log(value)
    }
  }
}
