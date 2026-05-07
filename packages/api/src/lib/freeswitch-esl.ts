import * as net from "node:net";

const ESL_HOST = process.env.FREESWITCH_ESL_HOST ?? "135.181.31.20";
const ESL_PORT = Number(process.env.FREESWITCH_ESL_PORT ?? 8021);
const ESL_PASSWORD = process.env.FREESWITCH_ESL_PASSWORD ?? "HoloESL@2026";
const ESL_TIMEOUT = 5000;

/**
 * Send a single ESL API command and return the response body.
 * Opens a connection, authenticates, fires the command, then closes.
 */
export function eslCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let buffer = "";
    let authenticated = false;

    const done = (result: string) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(ESL_TIMEOUT);
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("ESL connection timed out"));
    });
    socket.on("error", (err) => reject(err));

    socket.on("data", (chunk) => {
      buffer += chunk.toString();

      if (!authenticated) {
        if (buffer.includes("auth/request")) {
          buffer = "";
          socket.write(`auth ${ESL_PASSWORD}\n\n`);
        } else if (buffer.includes("+OK accepted")) {
          authenticated = true;
          buffer = "";
          socket.write(`api ${command}\n\n`);
        } else if (buffer.includes("-ERR")) {
          socket.destroy();
          reject(new Error("ESL authentication failed"));
        }
        return;
      }

      // After sending the api command, wait for Content-Type: api/response
      // then collect the body
      if (buffer.includes("Content-Type: api/response")) {
        const bodyStart = buffer.indexOf("\n\n");
        if (bodyStart !== -1) {
          done(buffer.slice(bodyStart + 2).trim());
        }
      }
    });

    socket.connect(ESL_PORT, ESL_HOST);
  });
}

/**
 * Reload FreeSWITCH XML config (directory + dialplan).
 * Call after extension or DID changes.
 */
export async function reloadXml(): Promise<void> {
  try {
    await eslCommand("reloadxml");
  } catch (err) {
    console.error("[ESL] reloadxml failed:", err);
  }
}

/**
 * Restart the external SIP profile so new gateways/trunks take effect.
 * Call after trunk create/update/delete.
 */
export async function restartExternalProfile(): Promise<void> {
  try {
    await eslCommand("sofia profile external restart");
  } catch (err) {
    console.error("[ESL] sofia profile external restart failed:", err);
  }
}
