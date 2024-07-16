import TripService from "../service/trip.service"

export class TripController {
    private tripService: TripService

    constructor() {
        this.tripService = new TripService();
    }

    async getTripDetails(tripId: string) {
        return await this.tripService.getTripDetails(tripId)
    }

    async getTripParticipants(tripId: string){
        return await this.tripService.getTripParticipants(tripId)
    }

    async createTrip(trip: any) {
        return await this.tripService.createTrip(trip)
    }

    async confirmTrip(tripId: string) {
        return await this.tripService.confirmTrip(tripId)
    }

    async updateTrip(tripId: string, trip: any){
        return await this.tripService.updateTrip(tripId, trip)
    }
}