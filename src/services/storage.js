// Media upload/delete via MongoDB backend (Serverless API)

export const uploadProductMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Directly accessing the internal Vercel API
    const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (res.status === 413) {
        throw new Error('File too large. Vercel only allows up to 4.5MB per file.');
    }

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Upload failed (${res.status}): ${text.slice(0, 50)}`);
    }

    const data = await res.json();
    return data.url; // returns "/api/media/<id>"
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
        if (!url || !url.startsWith('/api/media')) return;
        // url is like "/api/media/6649abc123..."
        const res = await fetch(url, { method: 'DELETE' });
        if (!res.ok) console.error('Failed to delete media');
    } catch (e) {
        console.error('Failed to delete image:', e);
    }
};
