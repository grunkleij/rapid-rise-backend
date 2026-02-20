import { FileValidator } from '@nestjs/common';

/**
 * Known magic byte signatures for allowed file types.
 * This is more secure than checking the MIME type string,
 * because MIME types can be spoofed by the client.
 */
const MAGIC_SIGNATURES: { mime: string; bytes: number[] }[] = [
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    // JPEG: FF D8 FF
    { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
    // PDF: 25 50 44 46 (%PDF)
    { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
    // DOC (MS Office legacy): D0 CF 11 E0 A1 B1 1A E1
    { mime: 'application/msword', bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
    // DOCX (ZIP-based Office): 50 4B 03 04
    { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export interface MagicByteValidatorOptions {
    /** Max file size is handled by MaxFileSizeValidator, not here */
    allowedMimeTypes?: string[];
}

/**
 * Custom FileValidator that checks the actual binary magic bytes of the uploaded file.
 * Does NOT rely on the ESM-only `file-type` package.
 * Works with memory storage (file.buffer must be available).
 */
export class MagicByteValidator extends FileValidator<MagicByteValidatorOptions> {
    buildErrorMessage(file?: Express.Multer.File): string {
        const allowed = this.getAllowedMimes();
        if (file?.mimetype) {
            return `Validation failed: file claims to be "${file.mimetype}" but its magic bytes do not match any allowed type [${allowed.join(', ')}]`;
        }
        return `Validation failed: expected one of [${allowed.join(', ')}]`;
    }

    isValid(file?: Express.Multer.File): boolean {
        if (!file || !file.buffer || file.buffer.length === 0) {
            return false;
        }

        const allowed = this.getAllowedMimes();
        const signatures = MAGIC_SIGNATURES.filter(sig => allowed.includes(sig.mime));

        for (const sig of signatures) {
            if (file.buffer.length >= sig.bytes.length) {
                const matches = sig.bytes.every((byte, i) => file.buffer[i] === byte);
                if (matches) {
                    return true;
                }
            }
        }

        return false;
    }

    private getAllowedMimes(): string[] {
        return this.validationOptions?.allowedMimeTypes ?? MAGIC_SIGNATURES.map(s => s.mime);
    }
}
