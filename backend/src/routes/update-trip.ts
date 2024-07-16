import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { dayjs } from '../lib/dayjs';
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";

export async function updateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                destination: z.string().min(4).optional(),
                starts_at: z.coerce.date().optional(),
                ends_at: z.coerce.date().optional(),
                emails_to_invite: z.array(z.string().email()).optional()
            })
        },
    }, async (request) => {
        const { tripId } = request.params
        const { destination, starts_at, ends_at, emails_to_invite } = request.body

        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        if(dayjs(starts_at).isBefore(new Date())){
            throw new ClientError('Invalid trip start date')
        }

        if(dayjs(ends_at).isBefore(starts_at)){
            throw new ClientError('Invalid trip end date')
        }

        const updateData: any = {};
        if (destination) updateData.destination = destination;
        if (starts_at) updateData.starts_at = starts_at;
        if (ends_at) updateData.ends_at = ends_at;
        if (emails_to_invite && emails_to_invite.length > 0) {
            updateData.participants = {
                createMany: {
                    data: emails_to_invite.map(email => ({ email }))
                }
            };
        }

        await prisma.trip.update({
            where: { id: tripId },
            data: updateData
        });

        if(emails_to_invite && emails_to_invite.length > 0){

            const participants = await prisma.participant.findMany({
                select: { id: true, email: true },
                where: {
                    email: {
                        in: emails_to_invite
                    }
                }
            });

            const formattedStartDate = dayjs(trip.starts_at).format('LL')
            const formattedEndDate = dayjs(trip.ends_at).format('LL')

            const email = await getMailClient()

            await Promise.all([
                participants.map(async (participant) => {
                    console.log(participant.id)
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
    })
}