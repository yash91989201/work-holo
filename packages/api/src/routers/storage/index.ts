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
		.handler(async ({ input }) => {
			const result = await deleteFile({
				bucket: input.bucket as BucketName,
				filePath: input.filePath,
			});

			return result;
		}),

	deleteMany: protectedProcedure
		.input(DeleteFilesInput)
		.output(DeleteFilesOutput)
		.handler(async ({ input }) => {
			await deleteFiles(input.bucket as BucketName, input.filePaths);

			return {
				success: true,
				count: input.filePaths.length,
			};
		}),
};
