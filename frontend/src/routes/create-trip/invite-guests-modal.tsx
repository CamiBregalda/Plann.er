import { X, AtSign, Plus } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";

interface InviteGuestsModalProps {
  emailsToInvite: string[]
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void
  removeEmailFromInvites: (emailToRemove: string) => void
  closeGuestModal: () => void
}

export function InviteGuestsModal({ emailsToInvite, addNewEmailToInvite, removeEmailFromInvites, closeGuestModal }: InviteGuestsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Selecionar convidados</h2>
              <button type="button" onClick={closeGuestModal}>
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

        <div className="w-full h-px bg-zinc-800" />

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
      </div>
    </div>
  )
}