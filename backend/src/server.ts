import 'dotenv/config'; 
import app from "./app"

const PORT = parseInt(process.env.PORT || '8080', 10);

app.listen({ port: PORT }).then(() => {
    console.log(`Server running on port ${PORT}`);
}).catch((err: any) => {
    console.error('Error starting server:', err);
    process.exit(1);
});

export default app