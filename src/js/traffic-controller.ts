export default class TrafficController {
  private guestCount: number = 0

  addGuest(count: number) {
    this.guestCount = this.guestCount + count
  }
}
