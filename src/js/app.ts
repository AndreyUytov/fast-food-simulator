import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

export default class App {
  private reception: TrafficController
  private shef: TrafficController
  private waiter: TrafficController
  private timerForVisitorGeneration: ReturnType<typeof setInterval>

  constructor() {
    this.reception = new TrafficControll()
    this.shef = new TrafficControll()
    this.waiter = new TrafficControll()
  }

  addVisitor = () => {
    this.reception.addToQueue(new Order())
    console.log(`Всего гостей ждет ${this.reception.orderQueueLength}
    Текущий номер заказа ${this.reception.currentOrder?.orderNumber}`)
  }

  addOrder = (order: IOrder) => {
    this.shef.addToQueue(order)
    console.log(`всего заказов в очереди шефу ${this.shef.orderQueueLength}
    Текущий номер готовящегося заказа ${this.shef.currentOrder?.orderNumber}`)
  }

  addReadyOrder = (order: IOrder) => {
    this.waiter.addToQueue(order)
    console.log(`всего готовых заказов к выдаче ${this.waiter.orderQueueLength}
    Текущий номер заказа, готового к выдаче ${this.waiter.currentOrder?.orderNumber}`)
  }

  visitorLoop = (timer: number) => {
    return setInterval(() => this.addVisitor(), timer)
  }

  start() {
    this.reception.toggleMakeOrder(false)
    this.shef.toggleMakeOrder(false)
    this.waiter.toggleMakeOrder(false)

    this.reception.durationOfOrderInMs = 3000
    this.shef.durationOfOrderInMs = 6000
    this.waiter.durationOfOrderInMs = 5000

    this.timerForVisitorGeneration = this.visitorLoop(2000)

    this.reception.makeOrder(this.addOrder)

    this.shef.makeOrder(this.addReadyOrder)

    this.waiter.makeOrder(console.log)

    setTimeout(() => {
      console.log(`STOOOOOOOOOOOP`)

      this.stop()
    }, 10000)
  }

  stop() {
    clearInterval(this.timerForVisitorGeneration)
    this.reception.toggleMakeOrder(true)
    this.shef.toggleMakeOrder(true)
    this.waiter.toggleMakeOrder(true)
  }
}
