import path from "node:path";
import Fs from 'node:fs/promises'

export const ALLOWED_FILE_TYPES = 'jpeg|jpg|png|gif';

export function validateParameter(headerValue: string | string[] | undefined): string | undefined {
    if (typeof headerValue === 'string') {
        return headerValue;
    } else if (Array.isArray(headerValue)) {
        return headerValue[0];
    }
    return undefined;
}

export function isValidFileType(file: Express.Multer.File): boolean {
    const allowedTypesRegex = new RegExp(ALLOWED_FILE_TYPES, 'i');
    return allowedTypesRegex.test(path.extname(file.originalname).toLowerCase()) && allowedTypesRegex.test(file.mimetype.toLowerCase());
};

export function deleteFilebyPath(fullPath: string) {
    Fs.unlink(fullPath)
        .catch((error) => console.error('Error deleting file:', error))
}

export function generateThumbnailFileName(key: string): string {
    return 'thumbnail-' + key;
}
