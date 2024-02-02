import { Request } from "express";

export interface RequestWithUser extends Request {
    user_id?: string | string[],
    vendor_id?: string | string[],
}

export interface Attachment {
    messageId: string,
    userId: string,
    localPath: string,
    mimetype: string,
    fileExtension: string,
    previewLocalPath?: string,
}

export interface UploadOutput {
    thumbnail_download_url: string,
    attachment_id: string
}

export interface Storage {
    /**
     * Store an attachment
     * @param attachment The attachment to store
     * @return the attachment id
     */
    upload(attachment: Attachment): Promise<UploadOutput>

    //TODO
    /**
     * Retrive the attachment from the storage server
     * @param attachment_id the attachment id
     */
    // download(attachment_id :string): Promise<Attachment>
}
