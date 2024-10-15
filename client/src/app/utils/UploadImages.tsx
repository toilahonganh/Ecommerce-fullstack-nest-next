export const convertBase64 = (file: File) => {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export const uploadImages = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const base64Promises = Array.from(files).map((file) => convertBase64(file));
    const base64Images = await Promise.all(base64Promises);
    
    return base64Images.map(img => img as string);
};
