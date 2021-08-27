import { Order } from './order'

export interface TrafficController {
  addToQueue(order: Order): void
  get orderQueueLength(): number
  get orderQueueList(): Order[]
  get currentOrder(): Order
  set durationOfOrderInMs(ms: number)
  makeOrder(): any
}

export class TrafficControll implements TrafficController {
  private orderQueue: Order[] = []
  private durationOfOrder: number

  addToQueue(order: Order) {
    this.orderQueue.push(order)
  }

  get orderQueueLength() {
    return this.orderQueue.length
  }

  get orderQueueList() {
    return this.orderQueue
  }

  get currentOrder() {
    return this.orderQueue.shift()
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  [Symbol.asyncIterator]() {
    return {
      current: this.currentOrder,

      async next() {
        await new Promise((res) => setTimeout(res, this.durationOfOrder))

        if (this.current) {
          return { done: false, value: this.current }
        } else {
          return { done: true }
        }
      },
    }
  }

  async makeOrder() {
    for await (let value of this) {
      alert(value)
    }
  }
}
