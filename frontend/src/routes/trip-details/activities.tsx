import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Activity, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { DeleteActivityModal } from "./delete-activity-modal"

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
                                        <button
                                            key={activity.id}
                                            className="w-full text-left px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3"
                                            onClick={() => openDeleteActivityModal(activity)}
                                        >
                                            <CircleCheck className="size-5 text-lime-300"/>
                                            <span className="text-zinc-100">{activity.title}</span>
                                            <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>
                                        </button>
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
        </div>
    )
}