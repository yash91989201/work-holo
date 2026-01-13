import { JoinGrantClaims } from "@work-holo/realtime-shared";
import { jwtVerify } from "jose";

export class GrantVerifier {
  private readonly secret: Uint8Array;

  constructor(secretString: string) {
    this.secret = new TextEncoder().encode(secretString);
  }

  async verify(token: string, expectedRoom: string): Promise<JoinGrantClaims> {
    const { payload } = await jwtVerify(token, this.secret, {
      issuer: "work-holo-server",
      audience: "work-holo-realtime",
    });

    const result = JoinGrantClaims.safeParse(payload);

    if (!result.success) {
      throw new Error(`Invalid grant claims: ${result.error.message}`);
    }

    if (result.data.room !== expectedRoom) {
      throw new Error(
        `Grant room mismatch: expected ${expectedRoom}, got ${result.data.room}`
      );
    }

    return result.data;
  }
}
