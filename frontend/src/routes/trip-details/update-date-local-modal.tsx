import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar, Tag, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface UpdateDateLocalModalProps {
    closeUpdateDateLocalModal: () => void,
    destination: string,
    startsDate: string,
    endsDate: string
}

interface UpdateTripData {
    starts_at?: string;
    ends_at?: string;
    destination?: string;
}

export function UpdateDateLocalModal({ closeUpdateDateLocalModal, destination, startsDate, endsDate }: UpdateDateLocalModalProps) {
    const { tripId } = useParams()
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()
    const [newDestination, setNewDestination] = useState("");
    const [isDestinationModified, setIsDestinationModified] = useState(false);
    const [isDateModified, setIsDateModified] = useState(false);

    const displayedDate = selectedDate && selectedDate.from && selectedDate.to 
    ? format(selectedDate.from, "d' de 'MMMM 'de' yyyy", { locale: ptBR }).concat(' até ').concat(format(selectedDate.to, "d' de 'MMMM 'de' yyyy", { locale: ptBR })) 
    : format(startsDate, "d' de 'MMMM 'de' yyyy", { locale: ptBR }).concat(' até ').concat(format(endsDate, "d' de 'MMMM 'de' yyyy", { locale: ptBR }))

    function openDatePicker() {
        setSelectedDate(undefined)
        setIsDatePickerOpen(true)
    }

    function closeDatePicker() {
        setIsDatePickerOpen(false)
    }

    function handleDestinationChange(event: ChangeEvent<HTMLInputElement>) {
        setNewDestination(event.target.value);
        setIsDestinationModified(event.target.value !== destination);
    }

    function handleDateChange(range: DateRange | undefined) {
        setSelectedDate(range);
        setIsDateModified(range?.from?.toString() !== startsDate || range?.to?.toString() !== endsDate);
    }

    async function updateInformationTrip() {
        const updateData: UpdateTripData = {};

        if (isDateModified) {
            updateData.starts_at = selectedDate?.from?.toString();
            updateData.ends_at = selectedDate?.to?.toString();
        }

        if (isDestinationModified) {
            updateData.destination = newDestination;
        }

        await api.put(`/trips/${tripId}`, updateData)
    
        closeUpdateDateLocalModal()
        window.document.location.reload()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Alterar local/data</h2>
                        <button type="button" onClick={closeUpdateDateLocalModal}>
                            <X className="size-5 text-zinc-400"/>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-zinc-400">Deseja alterar o local da viagem?</p>
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <Tag className="size-5 text-zinc-400"/>
                        <input type="text" name="title" placeholder={destination} value={newDestination} onChange={handleDestinationChange} className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"/>
                    </div>

                    <p className="text-sm text-zinc-400 pt-2">Deseja alterar a data da viagem?</p>
                    <button onClick={openDatePicker} className="flex items-center gap-2 mr-1 text-left w-full h-14 px-4 flex-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <Calendar className="size-5"/>
                        <span className="text-lg w-40 flex-1">{displayedDate}</span>
                    </button>

                    <div className="w-full h-px"/>

                    <Button onClick={updateInformationTrip} type="submit" size="full">
                        Alterar Viagem
                    </Button>
                </div>
            </div>

            {isDatePickerOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Selecione a data</h2>
                                <button type="button" onClick={closeDatePicker}>
                                    <X className="size-5 text-zinc-400"/>
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <DayPicker mode="range" selected={selectedDate} onSelect={handleDateChange} showOutsideDays locale={ptBR} weekStartsOn={0}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}