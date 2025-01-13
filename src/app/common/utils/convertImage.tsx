const convertImage = async (source: string, outType: string): Promise<string> => new Promise((resolve, reject) => {
    const img = new Image();
    img.src = source;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Failed to get 2D context'));
            return;
        }

        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL(outType);
        resolve(pngDataUrl);
    };

    img.onerror = () => {
        reject(new Error('Failed to load the image'));
    };
});

export default convertImage;
