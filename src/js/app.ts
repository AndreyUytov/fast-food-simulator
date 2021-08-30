import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

export default class App {
  private reception: TrafficController
  private shef: TrafficController
  private waiter: TrafficController

  constructor() {
    this.reception = new TrafficControll()
    this.shef = new TrafficControll()
    this.waiter = new TrafficControll()
  }

  addVisitor() {
    this.reception.addToQueue(new Order())
    console.log(`Всего гостей ждет ${this.reception.orderQueueLength}
    Текущий номер заказа ${this.reception.currentOrder}`)
  }

  addOrder(order: IOrder) {
    this.shef.addToQueue(order)
    console.log(`всего заказов в очереди шефу ${this.shef.orderQueueLength}
    Текущий номер готовящегося заказа ${this.shef.currentOrder}`)
  }

  addReadyOrder(order: IOrder) {
    this.waiter.addToQueue(order)
    console.log(`всего готовых заказов к выдаче ${this.waiter.orderQueueLength}
    Текущий номер заказа, готовогго к выдаче ${this.waiter.currentOrder}`)
  }

  visitorLoop(timer: number) {
    setInterval(() => this.addVisitor(), timer)
  }

  start() {
    this.reception.durationOfOrderInMs = 3000
    this.shef.durationOfOrderInMs = 3000
    this.waiter.durationOfOrderInMs = 3000

    this.visitorLoop(3000)

    this.reception.makeOrder(this.addOrder)

    this.shef.makeOrder(this.addReadyOrder)

    this.waiter.makeOrder(console.log)
  }
}
