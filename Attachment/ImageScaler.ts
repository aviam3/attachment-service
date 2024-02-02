import sharp from "sharp";

export interface ImageScaler {
    /**
     * Scaler an image to a max_width
     * 
     * @param filePath The path of the input image
     * @param suffix The end string of the file name
     * @param maxWidth The max width in pixels
     * @return The path of the image scaled
     */
    scale(filenam: string, fileSuffix: string, maxWidth: number): Promise<string>;

    /**
     * Return whater the image scaler supports scaling the given mim type
     * @param mimType The mim type
     * @return True if the scaler can scale the image
     */
    //TODO
    // supported(mimetype:string): boolean
}

export class SharpImageScaler implements ImageScaler {
    async scale(filePath: string, fileSuffix: string = '', maxWidth: number): Promise<string> {
        const newFilePath = filePath + fileSuffix;
        await sharp(filePath).resize(maxWidth).toFile(newFilePath);
        return newFilePath
    }
}
