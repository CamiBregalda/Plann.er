import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InviteGuestsModal } from "./invite-guests-modal"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { DestinationAndDateStep } from "./steps/destination-and-date-step"
import { InviteGuestsStep } from "./steps/invite-guests-step"
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false) 
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false) 
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false) 

  const [ouwerName, setOuwerName] = useState('')
  const [ouwerEmail, setOuwerEmail] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function openGuestInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestInput(){
    setIsGuestsInputOpen(false)
  }

  function openGuestModal() {
    setIsGuestsModalOpen(true)
  }
  
  function closeGuestModal() {
    setIsGuestsModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if(email){
      if(emailsToInvite.includes(email)){
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

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }
  
  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if(!destination) {
      return
    }

    if(!selectedDate?.from || !selectedDate?.to) {
      return
    }

    if(!ouwerName || !ouwerEmail){
      return
    }

    const response = await api.post('/trips', {
      destination: destination,
      starts_at: selectedDate.from,
      ends_at: selectedDate.to,
      emails_to_invite: emailsToInvite,
      owner_name: ouwerName,
      owner_email: ouwerEmail
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep 
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestInput={openGuestInput}
            closeGuestInput={closeGuestInput}
            setDestination={setDestination}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep 
              openGuestModal={openGuestModal}
              openConfirmTripModal={openConfirmTripModal}
              emailsToInvite={emailsToInvite}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda<br/>com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal 
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
          closeGuestModal={closeGuestModal}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal 
          createTrip={createTrip}
          closeConfirmTripModal={closeConfirmTripModal} 
          setOuwerName={setOuwerName}
          setOuwerEmail={setOuwerEmail}
        />
      )}

    </div>
  )
}
