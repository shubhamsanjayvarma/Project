import {
    collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
    query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const categoriesRef = collection(db, 'categories');

export const getCategories = async () => {
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createCategory = async (data) => {
    const docRef = await addDoc(categoriesRef, {
        ...data,
        active: true,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateCategory = async (id, data) => {
    await updateDoc(doc(db, 'categories', id), data);
};

export const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
};

// Default categories for initial setup
export const defaultCategories = [
    { name: 'Jeans', slug: 'jeans', description: 'Vintage & Designer Denim Jeans', order: 1, icon: '👖' },
    { name: "Levi's", slug: 'levis', description: "Authentic Levi's Vintage Denim", order: 2, icon: '🏷️' },
    { name: 'True Religion', slug: 'true-religion', description: 'True Religion Designer Denim', order: 3, icon: '✨' },
    { name: 'Japanese', slug: 'japanese', description: 'Japanese Selvedge & Art Denim', order: 4, icon: '🇯🇵' },
    { name: 'Shorts', slug: 'shorts', description: 'Vintage & Streetwear Shorts', order: 5, icon: '🩳' },
    { name: 'Hip Hop', slug: 'hip-hop', description: '90s & 2000s Hip Hop Streetwear', order: 6, icon: '🎤' },
    { name: 'Outerwear', slug: 'outerwear', description: 'Jackets, Coats, Blazers, Vests', order: 7, icon: '🧥' },
    { name: 'Vintage', slug: 'vintage', description: '70s, 80s, 90s, 2000s', order: 8, icon: '🎭' },
    { name: 'Designer', slug: 'designer', description: 'Premium & Luxury Brands', order: 9, icon: '💎' },
    { name: 'Bulk Deals', slug: 'bulk-deals', description: 'Mixed Bundles & Wholesale Lots', order: 10, icon: '📦' },
];

