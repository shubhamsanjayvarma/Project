import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Upload media directly to Firebase Storage bypasses Vercel's 4.5MB limit
export const uploadProductMedia = async (file) => {
    if (!file) throw new Error('No file provided');

    // Create a unique filename
    const ext = file.name.split('.').pop();
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Choose folder based on file type
    const isVideo = file.type.startsWith('video');
    const folder = isVideo ? 'products/videos' : 'products/images';

    const storageRef = ref(storage, `${folder}/${uniqueName}`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // We can add progress listener here if needed
            },
            (error) => {
                console.error('Firebase Upload Error:', error);
                reject(new Error('Failed to upload file to Firebase Storage'));
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
};

export const uploadProductImage = async (file) => uploadProductMedia(file);
export const uploadCategoryImage = async (file) => uploadProductMedia(file);
export const uploadBannerImage = async (file) => uploadProductMedia(file);

export const deleteImage = async (url) => {
    try {
        if (!url || !url.includes('firebasestorage.googleapis.com')) return;

        // Extract the file path from the Firebase Storage URL
        const decodedUrl = decodeURIComponent(url);
        const startIndex = decodedUrl.indexOf('/o/') + 3;
        const endIndex = decodedUrl.indexOf('?alt=media');

        if (startIndex > 2 && endIndex > startIndex) {
            const filePath = decodedUrl.substring(startIndex, endIndex);
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
        }
    } catch (e) {
        console.error('Failed to delete image from Firebase:', e);
    }
};
