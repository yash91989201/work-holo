import { channelRouter } from "./channel";
import { messageRouter } from "./message";

export const communicationRouter = {
  channel: channelRouter,
  message: messageRouter,
};
