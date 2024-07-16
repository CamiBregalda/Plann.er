import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { Routes } from "./routes/routes";

const app = fastify()

class App {
    private routesPrev: Routes

    constructor() {
        this.routesPrev = new Routes()

        var corsOptions = {
            origin: '*',
        }

        app.register(cors, corsOptions);

        app.setValidatorCompiler(validatorCompiler);
        app.setSerializerCompiler(serializerCompiler);

        app.setErrorHandler(errorHandler);
    }

    config() {
        this.routesPrev.routes(app)
    }

    getApp() {
        return app;
    }
}

const myApp = new App();
myApp.config();

export default myApp.getApp();