import { IOrder } from './order'

export interface TrafficController {
  addToQueue(order: IOrder): void
  get orderQueueLength(): number
  get orderQueueList(): IOrder[]
  get currentOrder(): IOrder
  set durationOfOrderInMs(ms: number)
  get durationOfOrderInMs(): number
  makeOrder(cb: (v: any) => any): Promise<void>
  toggleMakeOrder(value: boolean): void
}

export class TrafficControll implements TrafficController {
  private orderQueue: IOrder[] = []
  private durationOfOrder: number = 3000
  private order: IOrder = null
  private stopTraffic: boolean = false

  toggleMakeOrder(value: boolean) {
    this.stopTraffic = value
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

  private set currentOrder(order: IOrder) {
    this.order = order
  }

  private async getNextOrder() {
    let nextOrder = this.orderQueue.shift()
    let timer: ReturnType<typeof setInterval>

    if (nextOrder && !this.stopTraffic) {
      return await new Promise((res) => {
        res(nextOrder)
      })
    } else if (!nextOrder && !this.stopTraffic) {
      return await new Promise((res) => {
        timer = setInterval(() => {
          nextOrder = this.orderQueue.shift()
          if (nextOrder) {
            clearInterval(timer)
            res(nextOrder)
          }
        }, 1000)
      })
    } else if (this.stopTraffic) {
      clearInterval(timer)
      this.currentOrder = null
      this.orderQueue = []
    }
  }

  set durationOfOrderInMs(ms: number) {
    this.durationOfOrder = ms
  }

  get durationOfOrderInMs() {
    return this.durationOfOrder
  }

  async *[Symbol.asyncIterator]() {
    while (!this.stopTraffic) {
      let current = (await this.getNextOrder()) as IOrder
      this.currentOrder = current
      await new Promise((res) => setTimeout(res, this.durationOfOrder)) //Имитируем работу)
      yield current
      this.currentOrder = null
    }
  }

  async makeOrder(callBack: (v: any) => any) {
    for await (let value of this) {
      callBack(value)
    }
  }
}
