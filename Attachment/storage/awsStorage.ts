import { Storage, Attachment } from "../types"
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand, S3ClientConfig, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import { UploadOutput } from '../types'
import { generateThumbnailFileName } from "../helper";

const BUCKET_NAME = "examplebucket-temp";

interface UploadS3Result {
    fileURL: string,
    previewFileURL: string
}

export class AwsStorage implements Storage {
    private readonly s3Client: S3Client;

    public constructor() {
        const config: S3ClientConfig = {}
        if (process.env.NODE_ENV === 'development') {
            if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
                config.credentials = {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                };
            } else {
                throw new Error('AWS credentials are required in development mode.');
            }
        }
        this.s3Client = new S3Client(config);
    }

    async upload(attachment: Attachment): Promise<UploadOutput> {
        const attachment_id = uuidv4()
        const { previewFileURL } = await this.upload_s3(attachment, attachment_id)
        const url = await this.generateSignedUrl(BUCKET_NAME, previewFileURL)
        const uploadInfo: UploadOutput = {
            thumbnail_download_url: url,
            attachment_id: attachment_id
        }
        return uploadInfo
    }

    async generateSignedUrl(bucketName: string, key: string,): Promise<string> {
        if (!bucketName || !key) throw 'Missing key or bucketname'
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        })
        try {
            const preSignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour (3600 seconds)
            console.log("preSignedUrl: " + preSignedUrl)
            return preSignedUrl

        } catch (error) {
            console.error('Error generating signed URL:', error);
            throw error
        }

    }

    async upload_s3(attachment: Attachment, attachment_id: string): Promise<UploadS3Result> {
        const { messageId, mimetype, fileExtension, localPath, previewLocalPath } = attachment
        const key = attachment_id + fileExtension;

        const createUploadPromise = (message_id: string, file: fs.ReadStream, mimetype: string, bucketName: string, key: string) => {
            return this.s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                    Metadata: {
                        'message_id': message_id,
                        'mimetype': mimetype
                    },
                    Body: file
                })
            );
        }
        const mainUpload = createUploadPromise(messageId, fs.createReadStream(localPath), mimetype, BUCKET_NAME, key)
        const uploadPromises = [mainUpload];
        const thumbnailFileName = generateThumbnailFileName(key);
        if (previewLocalPath) {
            const previewUpload = createUploadPromise(messageId, fs.createReadStream(previewLocalPath), mimetype, BUCKET_NAME, thumbnailFileName)
            uploadPromises.push(previewUpload);
        }
        try {
            const result: PutObjectCommandOutput[] = await Promise.all(uploadPromises)
            console.log(result)

            return {
                fileURL: key,
                previewFileURL: thumbnailFileName
            }
        } catch (error) {
            console.error('Error occurred during file upload:', error);
            throw error
        }
    }
}
