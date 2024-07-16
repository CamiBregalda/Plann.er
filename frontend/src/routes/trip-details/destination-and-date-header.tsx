import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar, MapPin, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";
import { UpdateDateLocalModal } from "../trip-details/update-date-local-modal"

interface Trip {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirmed: boolean
}

export function DestinationAndDateHeader() {
    const { tripId } = useParams()
    const [trip, setTrip] = useState<Trip | undefined>()
    const [isUpdateDateLocalModalOpen, setIsUpdateDateLocalModalOpen] = useState(false) 

    useEffect(() => {
        api.get(`/trips/${tripId}`).then(response => {setTrip(response.data.trip)})
    }, [tripId])

    const displayedDate = trip ? format(trip.starts_at, "d' de 'LLL", { locale: ptBR }).concat(' até ').concat(format(trip.ends_at, "d' de 'LLL", { locale: ptBR })) : null

    function openUpdateDateLocalModal(){
        setIsUpdateDateLocalModalOpen(true)
    }

    function closeUpdateDateLocalModal(){
        setIsUpdateDateLocalModalOpen(false)
    }


    return (
        <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MapPin className="size-5 text-zinc-400"/>
                <span className="text-zinc-100">{trip?.destination}</span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 mr-1">
                    <Calendar className="size-5 text-zinc-400"/>
                    <span className="text-zinc-100">{displayedDate}</span>
                </div>

                <Button onClick={openUpdateDateLocalModal} color="gray" width='small'>
                    Alterar local/data
                    <Settings2 className="size-5"/>
                </Button>
            </div>

            {isUpdateDateLocalModalOpen && (
                <UpdateDateLocalModal closeUpdateDateLocalModal={closeUpdateDateLocalModal} destination={trip?.destination || ""} startsDate={trip?.starts_at || ""} endsDate={trip?.ends_at || ""} />  
            )}
        </div>

    )
}
