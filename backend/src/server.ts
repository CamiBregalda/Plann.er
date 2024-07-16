import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmParticipants } from "./routes/confirm-participant";
import { confirmTrip } from "./routes/confirm-trip";
import { createActivity } from "./routes/create-activity";
import { deleteActivity } from "./routes/delete-activity"
import { createLink } from "./routes/create-link";
import { createTrip } from "./routes/create-trip";
import { createInvite } from "./routes/create-invite";
import { getActivity } from "./routes/get-activities";
import { getLink } from "./routes/get-link";
import { getTripParticipant } from "./routes/get-trip-participants";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant"
import { errorHandler } from "./error-handler";
import { env } from "./env";
import 'dotenv/config'; 
import app from "./app"

/*
app.register(cors, {
    origin: '*',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

Feito:
app.register(getTripDetails)
app.register(getTripParticipant)
app.register(createTrip)
app.register(confirmTrip)
app.register(updateTrip)

app.register(getParticipant)
app.register(createInvite)
app.register(confirmParticipants)

app.register(createActivity)
app.register(getActivity)
app.register(deleteActivity)

app.register(createLink)
app.register(getLink)
*/

const PORT = parseInt(process.env.PORT || '8080', 10);

app.listen({ port: PORT }).then(() => {
    console.log(`Server running on port ${PORT}`);
}).catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});

export default app