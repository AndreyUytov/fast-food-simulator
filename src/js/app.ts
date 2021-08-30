import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

const traffic = new TrafficControll()

traffic.durationOfOrderInMs = 1000

for (let i = 0; i < 5; i++) {
  let order = new Order()
  traffic.addToQueue(order)
}

console.log(traffic.orderQueueList)
setTimeout(() => {
  traffic.addToQueue(new Order())
  console.log(traffic.orderQueueList)
}, 8000)

traffic.makeOrder(console.log).then(() => {
  console.log('done from then')
  console.log(traffic.orderQueueList)
})

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
  }

  addOrder(order: IOrder) {
    this.shef.addToQueue(order)
  }

  addReadyOrder(order: IOrder) {
    this.waiter.addToQueue(order)
  }

  visitorLoop() {
    setInterval(() => this.addVisitor(), 10000)
  }

  start() {
    this.visitorLoop()
  }
}
