import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Activity, CircleCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { DeleteActivityModal } from "./delete-activity-modal"
import { UpdateActivityModal } from "./update-activity-modal"

interface Activity {
    date: string,
    activities: {
        id: string,
        title: string,
        occurs_at: string,
        tripId: string
    }[]
}

interface ActivityDetails {
    id: string,
    title: string,
    occurs_at: string,
    tripId: string
}

export function Activities() {
    const { tripId } = useParams()
    const [activities, setActivities] = useState<Activity[]>([])
    const [isUpdateActivityModalOpen, setIsUpdateActivityModalOpen] = useState(false) 
    const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false) 
    const [selectedActivity, setSelectedActivity] = useState<ActivityDetails>();

    useEffect(() => {
        api.get(`trips/${tripId}/activity`).then(response => setActivities(response.data.activities))
    }, [tripId])

    function openDeleteActivityModal(activity: ActivityDetails){
        setSelectedActivity(activity)
        setIsDeleteActivityModalOpen(true)
    }

    function closeDeleteActivityModal(){
        setSelectedActivity(undefined)
        setIsDeleteActivityModalOpen(false)
    }

    function openUpdateActivityModal(activity: ActivityDetails){
        setSelectedActivity(activity)
        setIsUpdateActivityModalOpen(true)
    }

    function closeUpdateActivityModal(){
        setSelectedActivity(undefined)
        setIsUpdateActivityModalOpen(false)
    }

    return (
        <div className="space-y-8">
            {activities.map(categorie => {
                return (
                    <div key={categorie.date} className="space-y-2.5">
                        <div className="flex gap-2 items-baseline">
                            <span className="text-xl text-zinc-300 font-semibold">Dia {format(categorie.date, 'd')}</span>
                            <span className="text-xs text-zinc-500">{format(categorie.date, 'EEEE', { locale: ptBR })}</span>
                        </div>
                        {categorie.activities.length > 0 ? (
                            <div className="space-y-2.5">
                                {categorie.activities.map(activity => {
                                    return (
                                        <div key={activity.id} className="w-full bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                            <button
                                                className="text-left px-4 py-2.5 flex items-center gap-3 flex-1"
                                                onClick={() => openUpdateActivityModal(activity)}
                                            >
                                                <CircleCheck className="size-5 text-lime-300"/>
                                                <span className="text-zinc-100">{activity.title}</span>
                                            </button>
                                                <div className="ml-auto text-zinc-400 flex items-center space-x-2">
                                                    <span className="text-sm">{format(activity.occurs_at, 'HH:mm')}h</span>
                                                    <button type="button" onClick={() => openDeleteActivityModal(activity)}>
                                                        <X className="size-5 text-zinc-400 mr-3"/>
                                                    </button>
                                                </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
                        )}
                    </div>
                )
            })}

            { isDeleteActivityModalOpen && selectedActivity && (
                <DeleteActivityModal closeDeleteActivityModal={closeDeleteActivityModal} activity={selectedActivity}/>
            )}

            { isUpdateActivityModalOpen && selectedActivity && (
                <UpdateActivityModal closeUpdateActivityModal={closeUpdateActivityModal} activity={selectedActivity}/>
            )}
        </div>
    )
}