import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface Activity {
    id: string,
    title: string,
    occurs_at: string,
    tripId: string
}

interface DeleteActivityModalProps {
    closeDeleteActivityModal: () => void
    activity: Activity
}

export function DeleteActivityModal({ closeDeleteActivityModal, activity }: DeleteActivityModalProps) {
    const { tripId } = useParams()

    async function deleteActivity(){
        await api.delete(`/trips/${tripId}/activity/${activity.id}`, {})

        closeDeleteActivityModal()
        window.document.location.reload()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[410px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">

                <div className="space-y-2 text-center">
                    <h2 className="text-lg font-semibold">Deletar Atividade</h2>
                    <div className="text-center">
                        <p className="text-md">Tem certeza que deseja deletar a atividade: <br /><b>{activity.title}</b></p>
                        <p className="text-md mt-2">Marcada para: <b>{format(activity.occurs_at, 'd/LL')} às {format(activity.occurs_at, 'HH:mm')}h</b></p>
                    </div>
                    
                </div>

                <div className="flex justify-center space-x-4">
                    <Button onClick={deleteActivity} color="red" size="full">
                        Deletar atividade
                    </Button>
                    <Button onClick={closeDeleteActivityModal} color="gray" size="full">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    )
}