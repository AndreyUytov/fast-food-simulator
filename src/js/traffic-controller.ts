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
  private order: IOrder = null

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
    if (nextOrder) {
      return await new Promise((res) => {
        this.currentOrder = nextOrder
        res(nextOrder)
      })
    } else {
      return await new Promise((res) => {
        let timer = setInterval(() => {
          nextOrder = this.orderQueue.shift()
          if (nextOrder) {
            this.currentOrder = nextOrder
            clearInterval(timer)
            res(nextOrder)
          }
        }, 1000)
      })
    }
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      await new Promise((res) => setTimeout(res, this.durationOfOrder)) //Имитируем работу
      console.log()

      let current = await this.getNextOrder()
      yield current
    }
  }

  async makeOrder(callBack: (v: any) => any) {
    for await (let value of this) {
      callBack(value)
    }
  }
}
