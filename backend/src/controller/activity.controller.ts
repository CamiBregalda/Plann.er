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

    async updateActivity(tripId: string, activityId: string, activity: Activity){
        return await this.activityService.updateActivity(tripId, activityId, activity)
    }

    async deleteActivity(tripId: string, activityId: string){
        return await this.activityService.deleteActivity(tripId, activityId)
    }
}