import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { TripController } from "../controller/trip.controller";
import { env } from "../env";
import { ParticipantController } from "../controller/participant.controller";
import { ActivityController } from "../controller/activity.controller";
import { LinkController } from "../controller/link.controller";
import { Activity } from "../model/Activity";
import { Link } from "../model/Link";


export class Routes {
    private tripController: TripController;
    private participantController: ParticipantController;
    private activityController: ActivityController;
    private linkController: LinkController;

    constructor() {
        this.tripController = new TripController()
        this.participantController = new ParticipantController()
        this.activityController = new ActivityController()
        this.linkController = new LinkController()
    }

    routes(app: FastifyInstance) {

        //Buscar detalhes da viagem pelo id
        app.withTypeProvider<ZodTypeProvider>().get(`/trips/:tripId`, {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            return await this.tripController.getTripDetails(tripId)
        })

        //Buscar participantes relacionados a uma viagem
        app.withTypeProvider<ZodTypeProvider>().get(`/trips/:tripId/participants`, {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            return await this.tripController.getTripParticipants(tripId)
        })

        //Criar viagem
        app.withTypeProvider<ZodTypeProvider>().post(`/trips`, {
            schema: {
                body: z.object({
                    destination: z.string({ required_error: 'Destination is required.' }).min(4),
                    starts_at: z.coerce.date(),
                    ends_at: z.coerce.date(),
                    owner_name: z.string(),
                    owner_email: z.string().email(),
                    emails_to_invite: z.array(z.string().email())
                })
            },
        }, async (request) => {
            const trip = request.body
            return await this.tripController.createTrip(trip)
        })

        //Confirmar viagem - É chamado através do link de confirmação enviado ao e-mail
        app.withTypeProvider<ZodTypeProvider>().get(`/trips/:tripId/confirm`, {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                })
            },
        }, async (request, reply) => {
            const { tripId } = request.params
            await this.tripController.confirmTrip(tripId)
            return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
        })

        //Atualizar dados da viagem
        app.withTypeProvider<ZodTypeProvider>().put(`/trips/:tripId`, {
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
            return await this.tripController.updateTrip(tripId, request.body)
        })

        //Buscar dados de um participante pelo id
        app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
            schema: {
                params: z.object({
                    participantId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { participantId } = request.params
            return await this.participantController.getParticipant(participantId)
        })

        //Enviar convite no email para os participantes da viagem
        app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invite', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                }),
                body: z.object({
                    email: z.string().email()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            const { email } = request.body
            return await this.participantController.createInvite(tripId, email)
        })

        //Confirmar participante - É chamado através do link de confirmação enviado ao e-mail
        app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm', {
            schema: {
                params: z.object({
                    participantId: z.string().uuid()
                })
            },
        }, async (request, reply) => {
            const { participantId } = request.params
            const tripId = await this.participantController.confirmParticipants(participantId)
            return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
        })

        //Criar atividade
        app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activity', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                }),
                body: z.object({
                    title: z.string().min(4),
                    occurs_at: z.coerce.date()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            const { title, occurs_at } = request.body

            const activity: Activity = { tripId, title, occurs_at };
            return await this.activityController.createActivity(activity)
        })

        //Buscar todas as atividades relacionadas a uma viagem pelo id
        app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activity', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            return await this.activityController.getActivity(tripId)
        })

        //Deletar atividade de uma viagem
        app.withTypeProvider<ZodTypeProvider>().delete('/trips/:tripId/activity/:activityId', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid(),
                    activityId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { tripId, activityId } = request.params
            return await this.activityController.deleteActivity(tripId, activityId)
        })

        //Buscar links de uma viagem pelo seu id
        app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/link', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            return await this.linkController.getLink(tripId)
        })

        //Criar link para atividade
        app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/link', {
            schema: {
                params: z.object({
                    tripId: z.string().uuid()
                }),
                body: z.object({
                    title: z.string().min(4),
                    url: z.string().url()
                })
            },
        }, async (request) => {
            const { tripId } = request.params
            const { title, url } = request.body

            const link: Link = {title, url, tripId}
            return await this.linkController.createLink(link)
        })
    }
}