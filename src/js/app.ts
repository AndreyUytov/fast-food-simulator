import { Order } from './order'
import { TrafficControll } from './traffic-controller'

const traffic = new TrafficControll()

traffic.durationOfOrderInMs = 3000

for (let i = 0; i < 5; i++) {
  let order = new Order()
  traffic.addToQueue(order)
}

console.log(traffic.orderQueueList)

traffic.makeOrder()
