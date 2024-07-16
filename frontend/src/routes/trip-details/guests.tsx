import { UserCog, CircleDashed, CheckCircle } from "lucide-react";
import { Button } from "../../components/button";
import { UpdateParticipantsModal } from "./update-participants-modal"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";

interface Participant {
    id: string,
    name: string | null,
    email: string,
    is_confirmed: boolean
}

export function Guests() {
    const { tripId } = useParams()
    const [participants, setParticipants] = useState<Participant[]>([])
    const [isUpdateParticipantsModalOpen, setIsUpdateParticipantsModalOpen] = useState(false) 

    useEffect(() => {
        api.get(`trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
    }, [tripId])

    function openUpdateParticipantsModal() {
        setIsUpdateParticipantsModalOpen(true)
    }

    function closeUpdateParticipantsModal() {
        setIsUpdateParticipantsModalOpen(false)
    }

    return(
        <div className="space-y-6">
            <h2 className="font-semibold text-xl">Convidados</h2>
            <div className="space-y-5">
                {participants.map((participant, index) => {
                    return (
                        <div key={participant.id} className="flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
                                <span className="block text-sm text-zinc-400 truncate">{participant.email}</span>
                            </div>
                            {participant.is_confirmed ? (
                                <CheckCircle className="text-green-400 size-5 shrink-0"/>
                            ) : (
                                <CircleDashed className="text-zinc-400 size-5 shrink-0"/>
                            )}
                        </div>
                    )
                })}
            </div>
            
            <Button onClick={openUpdateParticipantsModal} color="gray" size="full" width="small">
                <UserCog className="size-5"/>
                Gerenciar convidados
            </Button>

            
            {isUpdateParticipantsModalOpen && (
                <UpdateParticipantsModal closeUpdateParticipantsModal={closeUpdateParticipantsModal} participants={participants}/>
            )}
        </div>
    )
}