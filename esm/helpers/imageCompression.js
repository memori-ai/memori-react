const DEFAULT_OPTIONS = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.75,
    maxSizeMB: 2,
};
const applyOrientation = (ctx, orientation, width, height) => {
    switch (orientation) {
        case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
        case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
        case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
        case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
        case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
        case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
        case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
        default:
            break;
    }
};
const loadImage = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
};
const calculateDimensions = (width, height, maxWidth, maxHeight) => {
    if (width <= maxWidth && height <= maxHeight) {
        return { width, height };
    }
    const scaleWidth = maxWidth / width;
    const scaleHeight = maxHeight / height;
    const scale = Math.min(scaleWidth, scaleHeight, 1);
    return {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
    };
};
export const compressImage = async (file, options = {}) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const fileSizeMB = file.size / (1024 * 1024);
    const shouldCompress = fileSizeMB > 1;
    if (!shouldCompress) {
        try {
            const img = await loadImage(file);
            const needsResize = img.width > opts.maxWidth || img.height > opts.maxHeight;
            if (!needsResize) {
                return file;
            }
        }
        catch (error) {
            return file;
        }
    }
    try {
        const img = await loadImage(file);
        const orientation = 1;
        const { width, height } = calculateDimensions(img.width, img.height, opts.maxWidth, opts.maxHeight);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        applyOrientation(ctx, orientation, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to compress image'));
                    return;
                }
                const compressedSizeMB = blob.size / (1024 * 1024);
                if (compressedSizeMB > opts.maxSizeMB) {
                    canvas.toBlob((lowerQualityBlob) => {
                        if (!lowerQualityBlob) {
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
                            resolve(compressedFile);
                            return;
                        }
                        const compressedFile = new File([lowerQualityBlob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
                        resolve(compressedFile);
                    }, 'image/jpeg', Math.max(0.5, opts.quality - 0.2));
                }
                else {
                    const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
                    resolve(compressedFile);
                }
            }, 'image/jpeg', opts.quality);
        });
    }
    catch (error) {
        return file;
    }
};
//# sourceMappingURL=imageCompression.js.map