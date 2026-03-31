import { attachmentRouter } from "./attachment";
import { channelRouter } from "./channel";
import { dmRouter } from "./dm";
import { messageRouter } from "./message";

export const communicationRouter = {
  attachment: attachmentRouter,
  channel: channelRouter,
  dm: dmRouter,
  message: messageRouter,
};
