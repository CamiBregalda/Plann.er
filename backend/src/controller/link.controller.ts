import LinkService from "../service/link.service";
import { Link } from "../model/Link";

export class LinkController {
    private linkService: LinkService

    constructor() {
        this.linkService = new LinkService();
    }

    async getLink(tripId: string){
        return await this.linkService.getLink(tripId)
    }

    async createLink (link: Link){
        return await this.linkService.createLink(link)
    }
}