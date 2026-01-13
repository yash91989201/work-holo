import { env } from "./env";
import { app } from "./websocket";

app.listen(env.PORT);

console.log(`Realtime server listening on port ${env.PORT}`);
