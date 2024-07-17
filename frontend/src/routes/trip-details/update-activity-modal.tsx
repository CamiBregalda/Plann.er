import { format } from "date-fns";
import { Calendar, Tag, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { api } from "../../lib/axios";

interface Activity {
    id: string,
    title: string,
    occurs_at: string,
    tripId: string
}

interface UpdateActivityModalProps {
    closeUpdateActivityModal: () => void
    activity: Activity
}

export function UpdateActivityModal({ closeUpdateActivityModal, activity }: UpdateActivityModalProps) {
    const { tripId } = useParams()
    const formattedOccursAt = format((new Date(activity.occurs_at)), "yyyy-MM-dd'T'HH:mm");
    const [newTitle, setNewTitle] = useState(activity.title);
    const [newDataLocal, setNewDataLocal] = useState(formattedOccursAt);

    async function UpdateActivity(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        await api.put(`/trips/${tripId}/activity/${activity.id}`, {
            title: newTitle,
            occurs_at: newDataLocal
        })

        closeUpdateActivityModal()
        window.document.location.reload()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Atualizar atividade</h2>
                        <button type="button" onClick={closeUpdateActivityModal}>
                            <X className="size-5 text-zinc-400"/>
                        </button>
                    </div>
        
                </div>

                <form onSubmit={UpdateActivity} className="space-y-3">
                    <p className="text-sm text-zinc-400">Deseja atualizar o título da atividade?</p>
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <Tag className="size-5 text-zinc-400"/>
                        <Input type="text" name="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
                    </div>

                    <p className="text-sm text-zinc-400 pt-2">Deseja atualizar a data e horário da atividade?</p>
                    <div className="h-14 px-4 flex-1 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <Calendar className="size-5 text-zinc-400"/>
                        <Input type="datetime-local" name="occurs_at" value={newDataLocal} onChange={(e) => setNewDataLocal(e.target.value)}/>
                    </div>

                    <Button type="submit" size="full">
                        Atualizar atividade
                    </Button>
                </form>
            </div>
        </div>
    )
}