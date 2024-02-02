import { Response } from "express";
import { RequestWithUser, UploadOutput, Attachment, Storage } from "./types";
import storageFactory from "./storage/storageFactory";
import path from "path";
import { ALLOWED_FILE_TYPES, deleteFilebyPath, isValidFileType, validateParameter } from "./helper";
import { ImageScaler, SharpImageScaler } from "./ImageScaler";
const LOCAL_THUMBNAIL_PATH_SUFFIX: string = "-thumbnail";

class UploadRequest {
  private readonly storage;
  private readonly scaler: ImageScaler;
  private readonly THUMBNAIL_MAX_WIDTH_PX = 250;

  constructor(storage: Storage, scaler: ImageScaler) {
    this.storage = storage;
    this.scaler = scaler;
  }
  async upload(attachment: Attachment): Promise<UploadOutput> {
    attachment.previewLocalPath = await this.scaler.scale(attachment.localPath, LOCAL_THUMBNAIL_PATH_SUFFIX, this.THUMBNAIL_MAX_WIDTH_PX)
    return await this.storage.upload(attachment);
  }
}

export async function upload(req: RequestWithUser, res: Response): Promise<void> {
  try {
    const { user_id: userId, vendor_id: vendorId } = req.headers;
    const messageId = validateParameter(req.body.message_id)
    const file = req.file;

    if (!file) {
      res.status(400).send({ error: 'No file' });
      return;
    }

    if (!messageId) {
      res.status(400).send('Invalid body parameters');
      return
    }

    if (!isValidFileType(file)) {
      res.status(400).send(`Invalid file type. Allowed file types: ${ALLOWED_FILE_TYPES.split("|").join(",")}.`);
      return;
    }

    const attachment: Attachment = {
      localPath: path.join(process.cwd(), file.path),
      mimetype: file.mimetype,
      fileExtension: path.extname(file.originalname).toLowerCase(),
      userId: userId as string,
      messageId: messageId!
    };

    const storage = storageFactory.createStorage(vendorId as string)
    const imageScaler = new SharpImageScaler()
    const uploadRequest = new UploadRequest(storage, imageScaler);
    const uploadOutput = await uploadRequest.upload(attachment);

    deleteFilebyPath(attachment.localPath)
    deleteFilebyPath(attachment.previewLocalPath!)

    res.status(200).json({
      ...uploadOutput
    })

  } catch (error) {
    res.status(500).json({
      message: "Error occurred during file upload",
      error: (error as Error).message,
    })
  }
}


