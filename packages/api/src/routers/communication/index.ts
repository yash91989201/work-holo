import { channelRouter } from "./channel";
import { dmRouter } from "./dm";
import { messageRouter } from "./message";

export const communicationRouter = {
  channel: channelRouter,
  dm: dmRouter,
  message: messageRouter,
};
