import { protectedProcedure } from "../../index";
import {
  DeleteFileInput,
  DeleteFileOutput,
  DeleteFilesInput,
  DeleteFilesOutput,
  GetUploadUrlInput,
  GetUploadUrlOutput,
} from "../../lib/schemas/storage";

export const storageRouter = {
  getUploadUrl: protectedProcedure
    .input(GetUploadUrlInput)
    .output(GetUploadUrlOutput)
    .handler(({ input, context }) =>
      context.storage.getUploadUrl({
        bucket: input.bucket,
        fileName: input.fileName,
        contentType: input.contentType,
        fileSize: input.fileSize,
      })
    ),

  delete: protectedProcedure
    .input(DeleteFileInput)
    .output(DeleteFileOutput)
    .handler(({ input, context }) =>
      context.storage.deleteFile({
        bucket: input.bucket,
        filePath: input.filePath,
      })
    ),

  deleteMany: protectedProcedure
    .input(DeleteFilesInput)
    .output(DeleteFilesOutput)
    .handler(async ({ input, context }) => {
      await context.storage.deleteFiles(input.bucket, input.filePaths);

      return {
        success: true,
        count: input.filePaths.length,
      };
    }),
};
