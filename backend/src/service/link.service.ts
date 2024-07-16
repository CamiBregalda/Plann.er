import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";
import { Link } from "../model/Link";

export default class LinkService {

    async getLink(tripId: string){
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: { links: true }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        return { links: trip.links }
    }

    async createLink (link: Link){
        const trip = await prisma.trip.findUnique({
            where: { id: link.tripId }
        })

        if(!trip){
            throw new ClientError('Trip not found')
        }

        const createLink = await prisma.link.create({
            data: {
                title: link.title,
                url: link.url,
                tripId: link.tripId
            }
        })

        return { linkId: createLink.id, title: createLink.title, url: createLink.url, tripId: createLink.tripId }
    }
}