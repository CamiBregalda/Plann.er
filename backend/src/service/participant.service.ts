import nodemailer from 'nodemailer';
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { dayjs } from '../lib/dayjs';
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";

export default class ParticipantService {

    async getParticipant(participantId: string){
        const participant = await prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true
            },
            where: { id: participantId }
        })

        if(!participant){
            throw new ClientError('Participant not found')
        }

        return { participant }
    }

    async createInvite(tripId: string, email: string){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        const participant = await prisma.participant.create({
            data: {
                email,
                tripId: trip.id
            }
        })

        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.ends_at).format('LL')

        const mail = await getMailClient()

        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

        const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'equipe@plann.er'
            },
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                    <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                    <p></p>
                    <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                    <p></p>
                    <p>
                        <a href="${confirmationLink}">Confirmar viagem</a>
                    </p>
                    <p></p>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                </div>
            `.trim()
        })
        
        console.log(nodemailer.getTestMessageUrl(message))
        
        return { participant }
    }

    async confirmParticipants(participantId: string){
        const participant = await prisma.participant.findUnique(
            { where: { id: participantId } }
        )

        if(!participant) {
            throw new ClientError('Participant not found.')
        }

        if(participant.is_confirmed) {
            return participant.tripId
        }

        await prisma.participant.update({
            where: { id: participantId },
            data: { is_confirmed: true }
        })

        return participant.tripId
    }
}