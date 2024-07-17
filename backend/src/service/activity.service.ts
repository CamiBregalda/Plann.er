import { ClientError } from "../errors/client-error";
import { dayjs } from '../lib/dayjs';
import { prisma } from "../lib/prisma";
import { Activity } from "../model/Activity";

export default class ParticipantService {

    async createActivity(activity: Activity){
        const trip = await prisma.trip.findUnique({
            where: { id: activity.tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        if(dayjs(activity.occurs_at).isBefore(trip.starts_at) || dayjs(activity.occurs_at).isAfter(trip.ends_at)){
            throw new ClientError('Invalid activity date')
        }

        const createActivity = await prisma.activity.create({
            data: {
                title: activity.title,
                occurs_at: activity.occurs_at,
                tripId: activity.tripId
            }
        })

        return { activityId: createActivity.id, title: createActivity.title, occurs_at: createActivity.occurs_at, tripId: createActivity.tripId }
    }

    async getActivity(tripId: string){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { activities: { orderBy: { occurs_at: 'asc'} } }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        const diferrenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'days')

        const activities = Array.from({ length: diferrenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {
            const date = dayjs(trip.starts_at).add(index, 'days')

            return {
                date: date.toDate(),
                activities: trip.activities.filter(activity => {
                    return dayjs(activity.occurs_at).isSame(date, 'day')
                })
            }
        })

        return { activities: activities }
    }

    async updateActivity(tripId: string, activityId: string, activityUpdate: Activity){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        if(dayjs(activityUpdate.occurs_at).isBefore(trip.starts_at) || dayjs(activityUpdate.occurs_at).isAfter(trip.ends_at)){
            throw new ClientError('Invalid activity date')
        }

        const updateData: any = {};
        if (activityUpdate.title) updateData.title = activityUpdate.title;
        if (activityUpdate.occurs_at) updateData.occurs_at = activityUpdate.occurs_at;

        await prisma.activity.update({
            where: { id: activityId },
            data: updateData
        });

        return { tripId: trip.id }
    }

    async deleteActivity(tripId: string, activityId: string){
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
    }
}