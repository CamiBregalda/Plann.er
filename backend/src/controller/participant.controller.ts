import ParticipantService from "../service/participant.service"

export class ParticipantController {
    private participantService: ParticipantService

    constructor() {
        this.participantService = new ParticipantService();
    }

    async getParticipant(participantId: string){
        return await this.participantService.getParticipant(participantId)
    }

    async createInvite(tripId: string, email: string){
        return await this.participantService.createInvite(tripId, email)
    }

    async confirmParticipants(participantId: string){
        return await this.participantService.confirmParticipants(participantId)
    }
}