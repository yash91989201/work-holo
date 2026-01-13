import { env } from "@work-holo/env/realtime";
import { app } from "./websocket";

app.listen(env.PORT);

console.log(`Realtime server listening on port ${env.PORT}`);
