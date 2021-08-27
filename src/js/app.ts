import { TrafficControll } from './traffic-controller'

const traffic = new TrafficControll()

traffic.durationOfOrderInMs = 1000

for (let i = 0; i < 5; i++) {
  let order = new Order()
  traffic.addToQueue()
}
