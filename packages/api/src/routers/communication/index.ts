import { attachmentRouter } from "./attachment";
import { callRouter } from "./call";
import { channelRouter } from "./channel";
import { dmRouter } from "./dm";
import { messageRouter } from "./message";

export const communicationRouter = {
  attachment: attachmentRouter,
  call: callRouter,
  channel: channelRouter,
  dm: dmRouter,
  message: messageRouter,
};
