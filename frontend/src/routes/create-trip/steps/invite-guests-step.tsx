import { ArrowRight, UserRoundPlus } from "lucide-react";
import { Button } from "../../../components/button";

interface InviteGuestsStepProps {
    openGuestModal: () => void
    openConfirmTripModal: () => void
    emailsToInvite: string[]
}

export function InviteGuestsStep( { openGuestModal, openConfirmTripModal, emailsToInvite} : InviteGuestsStepProps) {
    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <button type="button" onClick={openGuestModal} className="flex items-center gap-2 flex-1 mr-1">
                <UserRoundPlus className="size-5 text-zinc-400" />
                { emailsToInvite.length > 0 ? (
                    <span className="text-zinc-400 text-lg text-left flex-1">{emailsToInvite.length} pessoa(s) convidada(s)</span>
                ) : (
                    <span className="text-zinc-400 text-lg text-left flex-1">Quem estará na viagem</span>
                )}
            </button>
            
            <Button onClick={openConfirmTripModal}>
                Confirmar viagem
                <ArrowRight className="size-5"/>
            </Button>
        </div>
    )
}