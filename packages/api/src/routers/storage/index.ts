import { protectedProcedure } from "../../index";
import {
  DeleteFileInput,
  DeleteFileOutput,
  DeleteFilesInput,
  DeleteFilesOutput,
  GetUploadUrlInput,
  GetUploadUrlOutput,
} from "../../lib/schemas/storage";
import {
  type BucketName,
  deleteFile,
  deleteFiles,
  getUploadUrl,
} from "../../lib/storage";

export const storageRouter = {
  getUploadUrl: protectedProcedure
    .input(GetUploadUrlInput)
    .output(GetUploadUrlOutput)
    .handler(async ({ input, context }) => {
      const result = await getUploadUrl({
        bucket: input.bucket as BucketName,
        fileName: input.fileName,
        contentType: input.contentType,
        fileSize: input.fileSize,
        userId: context.session.user.id,
      });

      return result;
    }),

  delete: protectedProcedure
    .input(DeleteFileInput)
    .output(DeleteFileOutput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify file ownership by checking if the filePath starts with the user's ID
      if (!input.filePath.startsWith(`${userId}/`)) {
        throw new Error("You can only delete files you uploaded");
      }

      const result = await deleteFile({
        bucket: input.bucket as BucketName,
        filePath: input.filePath,
      });

      return result;
    }),

  deleteMany: protectedProcedure
    .input(DeleteFilesInput)
    .output(DeleteFilesOutput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify all files belong to the user
      const invalidFiles = input.filePaths.filter(
        (filePath) => !filePath.startsWith(`${userId}/`)
      );

      if (invalidFiles.length > 0) {
        throw new Error(
          `Cannot delete files not owned by you: ${invalidFiles.join(", ")}`
        );
      }

      await deleteFiles(input.bucket as BucketName, input.filePaths);

      return {
        success: true,
        count: input.filePaths.length,
      };
    }),
};
