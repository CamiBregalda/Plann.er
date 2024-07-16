import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { dayjs } from '../lib/dayjs';
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function deleteActivity(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/trips/:tripId/activity/:activityId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
                activityId: z.string().uuid()
            })
        },
    }, async (request) => {
        const { tripId, activityId } = request.params

        let trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { activities: true }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        const activity = await prisma.activity.findUnique({
            where: { id: activityId }
        });

        if(!activity){
            throw new ClientError('Activity not found')
        }

        await prisma.activity.delete({
            where: { id: activityId, tripId: tripId }
        });

        trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { activities: { orderBy: { occurs_at: 'asc'} } }
        })

        return { trip }
    })
}