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

  private getNextOrder() {
    let nextOrder = this.orderQueue.shift()
    return (this.currentOrder = nextOrder)
  }

  private set currentOrder(order: IOrder) {
    this.order = order
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  async *[Symbol.asyncIterator]() {
    let current = this.getNextOrder()
    while (current) {
      await new Promise((res) => setTimeout(res, this.durationOfOrder)) //Имитируем работу
      yield current
      current = this.getNextOrder()
      if (!current) {
        await new Promise((res) => {
          let timer = setInterval(() => {
            current = this.getNextOrder()
            console.log('timer')
            if (current) {
              res(current)
              clearInterval(timer)
            }
          }, 1000)
        })
      }
    }
  }

  async makeOrder(callBack: (v: any) => any) {
    for await (let value of this) {
      callBack(value)
    }
  }
}
