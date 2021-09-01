import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

export default class App {
  private reception: TrafficController
  private shef: TrafficController
  private waiter: TrafficController
  private timerForVisitorGeneration: ReturnType<typeof setInterval>
  private doneFastFoods: IOrder[] = []

  private guestCount: HTMLElement
  private currentAcceptedOrder: HTMLElement
  private currentCookingOrder: HTMLElement
  private cookingList: HTMLElement
  private currentDoneOrder: HTMLElement
  private waiterList: HTMLElement
  private doneFastFood: HTMLElement
  private startButton: HTMLElement
  private stopButton: HTMLElement

  constructor() {
    this.reception = new TrafficControll()
    this.shef = new TrafficControll()
    this.waiter = new TrafficControll()

    this.guestCount = document.getElementById('guest-count')
    this.currentAcceptedOrder = document.getElementById('reception-order')
    this.currentCookingOrder = document.getElementById('shef-order')
    this.cookingList = document.querySelector('.shef__list')
    this.currentDoneOrder = document.getElementById('waiter-order')
    this.waiterList = document.querySelector('.waiter__list')
    this.doneFastFood = document.getElementById('done-fast-food')

    this.startButton = document.querySelector('.start-button')
    this.stopButton = document.querySelector('.stop-button')

    this.startButton.addEventListener('click', () => {
      this.start()
    })

    this.stopButton.addEventListener('click', () => {
      this.stop()
    })
  }

  addVisitor = () => {
    this.reception.addToQueue(new Order())
  }

  addOrder = (order: IOrder) => {
    this.shef.addToQueue(order)
  }

  addReadyOrder = (order: IOrder) => {
    this.waiter.addToQueue(order)
  }

  addDoneDoneFastFood = (order: IOrder) => {
    this.doneFastFoods.push(order)
  }

  updateTextInfo = () => {
    console.log('animation')

    this.guestCount.textContent = `${this.reception.orderQueueLength}`
    this.currentAcceptedOrder.textContent = `${
      this.reception.currentOrder?.orderNumber || 'Wait guest'
    }`

    this.currentCookingOrder.textContent = `${
      this.shef.currentOrder?.orderNumber || 'Wait order'
    }`

    this.cookingList.innerHTML = this.shef.orderQueueList
      .map((el) => {
        return `
          <li>order № <span class="shef__order-number">${el.orderNumber}</span></li>
        `
      })
      .join('')

    this.currentDoneOrder.textContent = `${
      this.waiter.currentOrder?.orderNumber || 'Wait ready order'
    }`

    this.waiterList.innerHTML = this.waiter.orderQueueList
      .map((el) => {
        return `
            <li>order № <span class="shef__order-number">${el.orderNumber}</span></li>
          `
      })
      .join('')

    this.doneFastFood.textContent = `${this.doneFastFoods.length}`
    requestAnimationFrame(this.updateTextInfo)
  }

  visitorLoop = (timer: number) => {
    return setInterval(() => {
      this.addVisitor()
    }, timer)
  }

  start() {
    requestAnimationFrame(this.updateTextInfo)

    this.reception.toggleMakeOrder(false)
    this.shef.toggleMakeOrder(false)
    this.waiter.toggleMakeOrder(false)

    this.reception.durationOfOrderInMs = 3000
    this.shef.durationOfOrderInMs = 5000
    this.waiter.durationOfOrderInMs = 2000

    this.timerForVisitorGeneration = this.visitorLoop(3000)

    this.reception.makeOrder(this.addOrder)

    this.shef.makeOrder(this.addReadyOrder)

    this.waiter.makeOrder(this.addDoneDoneFastFood)
  }

  stop() {
    clearInterval(this.timerForVisitorGeneration)
    this.reception.toggleMakeOrder(true)
    this.shef.toggleMakeOrder(true)
    this.waiter.toggleMakeOrder(true)
  }
}
