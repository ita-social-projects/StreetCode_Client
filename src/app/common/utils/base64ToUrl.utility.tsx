const base64ToUrl = (base64Data: string | undefined, mimeType: string | undefined): string | undefined => {
    if (base64Data && mimeType) {
        const result = `data:${mimeType};base64,${base64Data}`;
        return result;
    }
};

export default base64ToUrl;
