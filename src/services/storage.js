import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadProductMedia = async (file) => {
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `products/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

export const uploadProductImage = async (file) => {
    return uploadProductMedia(file);
};

export const uploadCategoryImage = async (file) => {
    return uploadProductMedia(file);
};

export const uploadBannerImage = async (file) => {
    return uploadProductMedia(file);
};

export const deleteImage = async (url) => {
    try {
        if (!url || !url.includes('firebasestorage.googleapis.com')) return;
        const decodedUrl = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
        const storageRef = ref(storage, decodedUrl);
        await deleteObject(storageRef);
    } catch (e) {
        console.error('Failed to delete image:', e);
    }
};
