import { IOrder } from './order'

export interface TrafficController {
  addToQueue(order: IOrder): void
  get orderQueueLength(): number
  get orderQueueList(): IOrder[]
  get currentOrder(): IOrder
  set durationOfOrderInMs(ms: number)
  makeOrder(cb: (v: any) => any): Promise<void>
}

export class TrafficControll implements TrafficController {
  private orderQueue: IOrder[] = []
  private durationOfOrder: number
  private order: IOrder

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

  private set currentOrder(order: IOrder) {
    this.order = order
  }

  private async getNextOrder() {
    let nextOrder = this.orderQueue.shift()
    this.currentOrder = nextOrder
    if (this.currentOrder) {
      return this.currentOrder
    } else {
      await new Promise((res) => {
        let timer = setInterval(() => {
          this.currentOrder = this.orderQueue.shift()
          console.log('timer')
          if (this.currentOrder) {
            res(this.currentOrder)
            clearInterval(timer)
            return this.currentOrder
          }
        }, 1000)
      })
    }
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  async *[Symbol.asyncIterator]() {
    let current = await this.getNextOrder()
    while (current) {
      await new Promise((res) => setTimeout(res, this.durationOfOrder)) //Имитируем работу
      yield current
      current = await this.getNextOrder()
    }
  }

  async makeOrder(callBack: (v: any) => any) {
    for await (let value of this) {
      callBack(value)
    }
  }
}
