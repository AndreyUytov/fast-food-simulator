import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

const traffic = new TrafficControll()

const traffic2 = new TrafficControll()

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    traffic2.addToQueue(new Order())
    console.log('add')
  }, i * 1500)
}

setTimeout(() => {
  traffic2.addToQueue(new Order())
}, 14000)

traffic2.durationOfOrderInMs = 3000
traffic.durationOfOrderInMs = 4000
console.log(traffic)

console.log(traffic2.currentOrder, traffic2.orderQueueList)

let show = (order: IOrder) => {
  console.log(`----------show1
  CurrentOrder = ${traffic2.currentOrder?.orderNumber}
  order-parametr(done) = ${order.orderNumber}
  orderList = ${traffic2.orderQueueList.map((el) => el.orderNumber)}`)

  traffic.addToQueue(order)
  console.log(
    `traffic queue = ${traffic.orderQueueList.map((el) => el.orderNumber)}`
  )
}

let show2 = (order: IOrder) => {
  console.log(`--------------show2
  CurrentOrder = ${traffic.currentOrder?.orderNumber}
  order-parametr(done) = ${order.orderNumber}
  orderList = ${traffic.orderQueueList.map((el) => el.orderNumber)}`)
}

traffic2.makeOrder(show)

traffic.makeOrder(show2)

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
    Текущий номер заказа ${this.reception.currentOrder.orderNumber}`)
  }

  addOrder(order: IOrder) {
    this.shef.addToQueue(order)
    console.log(`всего заказов в очереди шефу ${this.shef.orderQueueLength}
    Текущий номер готовящегося заказа ${this.shef.currentOrder.orderNumber}`)
  }

  addReadyOrder(order: IOrder) {
    this.waiter.addToQueue(order)
    console.log(`всего готовых заказов к выдаче ${this.waiter.orderQueueLength}
    Текущий номер заказа, готового к выдаче ${this.waiter.currentOrder.orderNumber}`)
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
