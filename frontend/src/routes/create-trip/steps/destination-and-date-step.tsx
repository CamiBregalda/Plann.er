import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/button";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface DestinationAndDateStepProps {
    isGuestsInputOpen: boolean
    openGuestInput: () => void
    closeGuestInput: () => void
    setDestination: (destination: string) => void
    selectedDate: DateRange | undefined
    setSelectedDate: (dates: DateRange | undefined) => void
}

export function DestinationAndDateStep( {isGuestsInputOpen, openGuestInput, closeGuestInput, setDestination, selectedDate, setSelectedDate} : DestinationAndDateStepProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const displayedDate = selectedDate && selectedDate.from && selectedDate.to ? format(selectedDate.from, "d' de 'MMM", { locale: ptBR }).concat(' a ').concat(format(selectedDate.to, "d' de 'LLL", { locale: ptBR })) : 'Quando?'

    function openDatePicker() {
        setSelectedDate(undefined)
        setIsDatePickerOpen(true)
    }

    function closeDatePicker() {
        setIsDatePickerOpen(false)
    }

    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className="flex items-center gap-2 flex-1 mr-1">
                <MapPin className="size-5 text-zinc-400" />
                <input disabled={isGuestsInputOpen} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" onChange={event => setDestination(event.target.value)} />

            </div>
            
            <button onClick={openDatePicker} disabled={isGuestsInputOpen} className="flex items-center gap-2 mr-1 text-left text-zinc-400 w-[220px]">
                <Calendar className="size-5" />
                <span className="text-lg w-40 flex-1">{displayedDate}</span>
            </button>

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
                            <DayPicker mode="range" selected={selectedDate} onSelect={setSelectedDate} showOutsideDays locale={ptBR} weekStartsOn={0}/>
                        </div>
                    </div>
                </div>
            )}
            
            
            {isGuestsInputOpen ? (
                <Button onClick={closeGuestInput} color="gray" width="small">
                    Alterar local/data
                    <Settings2 className="size-5"/>
                </Button>
            ) : (
                <Button onClick={openGuestInput}>
                    Continuar
                    <ArrowRight className="size-5"/>
                </Button>
            )}
        </div>
    )
}