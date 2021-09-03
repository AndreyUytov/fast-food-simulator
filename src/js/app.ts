import { IOrder, Order } from './order'
import { TrafficControll, TrafficController } from './traffic-controller'

export default class App {
  private reception: TrafficController
  private shef: TrafficController
  private waiter: TrafficController
  private timerForVisitorGeneration: ReturnType<typeof setInterval>
  private doneFastFoods: IOrder[] = []
  private animateId: ReturnType<typeof requestAnimationFrame>

  private guestCount: HTMLElement
  private currentAcceptedOrder: HTMLElement
  private receptionList: HTMLElement
  private currentCookingOrder: HTMLElement
  private cookingList: HTMLElement
  private currentDoneOrder: HTMLElement
  private waiterList: HTMLElement
  private doneFastFood: HTMLElement
  private startButton: HTMLElement
  private stopButton: HTMLElement
  private receptionTimer: HTMLElement
  private shefTimer: HTMLElement
  private guestTimer: HTMLElement
  private guestInterval: number = 1000
  private isSimulationPlayed: boolean = false

  constructor() {
    this.reception = new TrafficControll()
    this.shef = new TrafficControll()
    this.waiter = new TrafficControll()

    this.guestCount = document.getElementById('guest-count')
    this.currentAcceptedOrder = document.getElementById('reception-order')
    this.receptionList = document.querySelector('.reception__list')
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

    this.guestTimer = document.getElementById('guest-timer')
    this.receptionTimer = document.getElementById('reception-timer')
    this.shefTimer = document.getElementById('shef-timer')

    this.guestTimer.addEventListener('click', this.timerListener)
    this.receptionTimer.addEventListener('click', this.timerListener)
    this.shefTimer.addEventListener('click', this.timerListener)
  }

  timerListener = (evt: PointerEvent) => {
    evt.preventDefault()
    if (this.isSimulationPlayed) return
    let target = evt.target as HTMLElement
    if (!target.classList.contains('timer__value-text')) return

    let label = target.nextElementSibling
    label.classList.toggle('visually-hidden')
    let input = label.querySelector('input')
    input.focus()

    let labelListener = (evt: PointerEvent) => {
      let button = evt.target as HTMLButtonElement
      if (!button.closest('BUTTON')) return

      let value = +input.value * 1000
      if (!value) {
        alert('value must be > 0!')
        return
      }

      if (target.closest('#guest-timer')) {
        this.guestInterval = value
      } else if (target.closest('#reception-timer')) {
        this.reception.durationOfOrderInMs = value
      } else {
        this.shef.durationOfOrderInMs = value
      }

      label.classList.toggle('visually-hidden')
      target.textContent = `${value / 1000}sec`

      label.removeEventListener('click', labelListener)
    }

    label.addEventListener('click', labelListener)
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

    this.receptionList.innerHTML = this.renderOrders(
      this.reception.orderQueueList
    )

    this.currentCookingOrder.textContent = `${
      this.shef.currentOrder?.orderNumber || 'Wait order'
    }`

    this.cookingList.innerHTML = this.renderOrders(this.shef.orderQueueList)

    this.currentDoneOrder.textContent = `${
      this.waiter.currentOrder?.orderNumber || 'Wait ready order'
    }`

    this.waiterList.innerHTML = this.renderOrders(this.waiter.orderQueueList)

    this.doneFastFood.textContent = `${this.doneFastFoods.length}`
    this.animateId = requestAnimationFrame(this.updateTextInfo)
  }

  renderOrders = (orderList: IOrder[]) => {
    let orders = [...orderList]
    if (orders.length > 7) {
      orders = orders.slice(0, 7)
    }
    return orders
      .map((el, i) => {
        return `
          <li>order № <span>${el.orderNumber}</span></li>
          ${i === 6 ? '...' : ''}
        `
      })
      .join('')
  }

  visitorLoop = () => {
    return setInterval(() => {
      this.addVisitor()
    }, this.guestInterval)
  }

  start() {
    this.isSimulationPlayed = true
    this.animateId = requestAnimationFrame(this.updateTextInfo)

    this.reception.toggleMakeOrder(false)
    this.shef.toggleMakeOrder(false)
    this.waiter.toggleMakeOrder(false)

    this.timerForVisitorGeneration = this.visitorLoop()

    this.reception.makeOrder(this.addOrder)

    this.shef.makeOrder(this.addReadyOrder)

    this.waiter.makeOrder(this.addDoneDoneFastFood)
  }

  stop() {
    this.isSimulationPlayed = false
    cancelAnimationFrame(this.animateId)
    clearInterval(this.timerForVisitorGeneration)
    this.reception.toggleMakeOrder(true)
    this.shef.toggleMakeOrder(true)
    this.waiter.toggleMakeOrder(true)
  }
}
