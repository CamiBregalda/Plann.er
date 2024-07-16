import { AtSign, Plus, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { api } from "../../lib/axios";

interface Participant {
    id: string,
    name: string | null,
    email: string,
    is_confirmed: boolean
}

interface UpdateParticipantsModalProps {
    closeUpdateParticipantsModal: () => void,
    participants: Participant[]
}

export function UpdateParticipantsModal({ closeUpdateParticipantsModal, participants }: UpdateParticipantsModalProps) {
    const { tripId } = useParams()
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
    
    function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
    
        const data = new FormData(event.currentTarget)
        const email = data.get('email')?.toString()
    
        if(email){
            if(participants.some(participant => participant.email === email)){
                alert("Pessoa já convidada.");
                return 
            }

            if(emailsToInvite.includes(email)){
                alert("Este e-mail já foi adicionado.");
                return 
            }

            setEmailsToInvite([...emailsToInvite, email])
        }
    
        event.currentTarget.reset()
    }
    
    function removeEmailFromInvites(emailToRemove: string){
        const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)
    
        setEmailsToInvite(newEmailList)
    }

    async function updateParticipantsTrip() {
        await api.put(`/trips/${tripId}`, {
            emails_to_invite: emailsToInvite
        })
    
        closeUpdateParticipantsModal()
        window.document.location.reload()
    }

    return(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Adicionar convidados</h2>
                    <button type="button" onClick={closeUpdateParticipantsModal}>
                        <X className="size-5 text-zinc-400"/>
                    </button>
                    </div>
                    <p className="text-sm text-zinc-400">Os convidados irão receber e-mails para confirmar a participação na viagem.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {emailsToInvite.map(email => {
                        return (
                        <div key={email} className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2">
                            <span className="text-zinc-300">{email}</span>
                            <button type="button">
                            <X onClick={() => removeEmailFromInvites(email)} className="size-4 text-zinc-400"/>
                            </button>
                        </div>
                        )
                    })}
                </div>

                <form onSubmit={addNewEmailToInvite} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                    <div className="px-2 flex items-center flex-1 gap-2">
                        <AtSign className="size-5 text-zinc-400"/>
                        <Input type="email" name="email" placeholder="Digite o e-mail do convidado"/>
                    </div>
                    
                    <Button type="submit">
                        Convidar
                        <Plus className="size-5"/>
                    </Button>
                </form>
                
                <div className="w-full h-px bg-zinc-800" />

                <Button onClick={updateParticipantsTrip} size="full">
                    Confirmar Convite
                </Button>
            </div>
        </div>
    )
}