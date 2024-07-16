import { Activity } from "../model/Activity";
import ActivityService from "../service/activity.service";

export class ActivityController {
    private activityService: ActivityService

    constructor() {
        this.activityService = new ActivityService();
    }

    async createActivity(activity: Activity){
        return await this.activityService.createActivity(activity)
    }

    async getActivity(tripId: string){
        return await this.activityService.getActivity(tripId)
    }

    async deleteActivity(tripId: string, activityId: string){
        return await this.activityService.deleteActivity(tripId, activityId)
    }
}