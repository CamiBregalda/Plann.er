import nodemailer from 'nodemailer';
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { dayjs } from '../lib/dayjs';
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { Trip } from "../model/Trip";

export default class TripService {

    async getTripDetails(tripId: string) {
        const trip = await prisma.trip.findUnique({
            select: {
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true
            },  
            where: { id: tripId }
        })
    
        if(!trip){
            throw new ClientError('Trip not found')
        }
    
        return { trip }
    }

    async getTripParticipants(tripId: string){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { participants: { 
                select: {
                    id: true, 
                    name: true,
                    email: true,
                    is_confirmed: true
                },
                orderBy: { name: 'desc'} 
            } }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        return { participants: trip.participants }
    }

    async createTrip(tripRequest: Trip){
        const endsAtDate: Date = new Date(tripRequest.ends_at.setHours(23, 59));

        if(dayjs(tripRequest.starts_at).isBefore(new Date())){
            throw new ClientError('Invalid trip start date')
        }

        if(dayjs(endsAtDate).isBefore(tripRequest.starts_at)){
            throw new ClientError('Invalid trip end date')
        }

        const trip = await prisma.trip.create({
            data: {
                destination: tripRequest.destination, 
                starts_at: tripRequest.starts_at, 
                ends_at: endsAtDate,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: tripRequest.owner_name,
                                email: tripRequest.owner_email,
                                is_owner: true,
                                is_confirmed: true
                            },
                            ...tripRequest.emails_to_invite.map(email => {
                                return { email }
                            })
                        ]
                    }
                }
            }
        })

        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(endsAtDate).format('LL')

        const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;
        
        const email = await getMailClient()

        const message = await email.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'equipe@plann.er'
            },
            to: {
                name: tripRequest.owner_name,
                address: tripRequest.owner_email
            },
            subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                    <p>Você solicitou a criação de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                    <p></p>
                    <p>Para confirmar sua viagem, clique no link abaixo:</p>
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

        return {tripId: trip.id, destination: trip.destination, starts_at: trip.starts_at, ends_at: trip.ends_at}
    }

    async confirmTrip(tripId: string) {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                participants: {
                    where: { is_owner: false }                
                }
            }
        })

        if(!trip) {
            throw new ClientError('Trip not found.')
        }
    
        if(trip.is_confirmed){
            return `${env.WEB_BASE_URL}/trips/${tripId}`
        }
    
        await prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true }
        })
    
        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.ends_at).format('LL')

        const email = await getMailClient()

        await Promise.all([
            trip.participants.map(async (participant) => {
                const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

                const message = await email.sendMail({
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
            })
        ])
    
    
        return `${env.WEB_BASE_URL}/trips/${tripId}`
    }

    async updateTrip(tripId: string, tripUpdate: Trip){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        if(tripUpdate.starts_at && tripUpdate.ends_at){
            if(dayjs(tripUpdate.starts_at).isBefore(new Date())){
                throw new ClientError('Invalid trip start date')
            }

            if(dayjs(tripUpdate.ends_at).isBefore(tripUpdate.starts_at)){
                throw new ClientError('Invalid trip end date')
            }
        }

        const updateData: any = {};
        if (tripUpdate.destination) updateData.destination = tripUpdate.destination;
        if (tripUpdate.starts_at) updateData.starts_at = tripUpdate.starts_at;
        if (tripUpdate.ends_at) {
            const endsAtDate: Date = new Date(tripUpdate.ends_at.setHours(23, 59));
            updateData.ends_at = endsAtDate;
        }
        if (tripUpdate.emails_to_invite && tripUpdate.emails_to_invite.length > 0) {
            updateData.participants = {
                createMany: {
                    data: tripUpdate.emails_to_invite.map(email => ({ email }))
                }
            };
        }

        await prisma.trip.update({
            where: { id: tripId },
            data: updateData
        });

        if(tripUpdate.emails_to_invite && tripUpdate.emails_to_invite.length > 0){

            const participants = await prisma.participant.findMany({
                select: { id: true, email: true },
                where: {
                    email: {
                        in: tripUpdate.emails_to_invite
                    }
                }
            });

            const formattedStartDate = dayjs(trip.starts_at).format('LL')
            const formattedEndDate = dayjs(trip.ends_at).format('LL')

            const email = await getMailClient()

            await Promise.all([
                participants.map(async (participant) => {
                    const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

                    const message = await email.sendMail({
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
                })
            ])
        }

        return { tripId: trip.id }
    }
}