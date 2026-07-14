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
    { name: 'Hip Hop Jeans', slug: 'hip-hop-jeans', description: 'Hip Hop Jeans', order: 1, icon: '👖' },
    { name: 'Hip Hop Shorts', slug: 'hip-hop-shorts', description: 'Hip Hop Shorts', order: 2, icon: '🩳' },
    { name: 'Carhartt Jeans', slug: 'carhartt-jeans', description: 'Carhartt Jeans', order: 3, icon: '👖' },
    { name: 'Dickies Jeans', slug: 'dickies-jeans', description: 'Dickies Jeans', order: 4, icon: '👖' },
    { name: 'Dickies Shorts', slug: 'dickies-shorts', description: 'Dickies Shorts', order: 5, icon: '🩳' },
    { name: 'Carhartt & Dickies Mix Shorts', slug: 'carhartt-dickies-mix-shorts', description: 'Carhartt & Dickies Mix Shorts', order: 6, icon: '🩳' },
    { name: 'Carhartt Shorts', slug: 'carhartt-shorts', description: 'Carhartt Shorts', order: 7, icon: '🩳' },
    { name: 'Japanese Jeans', slug: 'japanese-jeans', description: 'Japanese Jeans', order: 8, icon: '👖' },
    { name: 'Japanese Shorts', slug: 'japanese-shorts', description: 'Japanese Shorts', order: 9, icon: '🩳' },
    { name: "Levi's Mix Code", slug: 'levis-mix-code', description: "Levi's Mix Code", order: 10, icon: '🏷️' },
    { name: "Levi's Jeans", slug: 'levis-jeans', description: "Levi's Jeans", order: 11, icon: '🏷️' },
    { name: 'Levis Shorts', slug: 'levis-shorts', description: 'Levis Shorts', order: 12, icon: '🏷️' },
    { name: 'Evisu Jeans', slug: 'evisu-jeans', description: 'Evisu Jeans', order: 13, icon: '🎨' },
    { name: 'True Religion Jeans-Shorts', slug: 'true-religion-jeans-shorts', description: 'True Religion Jeans-Shorts', order: 14, icon: '✨' },
    { name: 'D&G-Armani', slug: 'dg-armani', description: 'D&G-Armani', order: 15, icon: '💎' },
    { name: 'Miss Me', slug: 'miss-me', description: 'Miss Me', order: 16, icon: '💅' },
    { name: 'Rock Revival', slug: 'rock-revival', description: 'Rock Revival', order: 17, icon: '🎸' },
    { name: 'Realtree Jeans', slug: 'realtree-jeans', description: 'Realtree Jeans', order: 18, icon: '🌲' },
    { name: 'G-Star Jeans', slug: 'g-star-jeans', description: 'G-Star Jeans', order: 19, icon: '⭐' },
    { name: 'Diesel Jeans', slug: 'diesel-jeans', description: 'Diesel Jeans', order: 20, icon: '🏍️' },
    { name: 'JNCO Jeans', slug: 'jnco-jeans', description: 'JNCO Jeans', order: 21, icon: '📐' },
    { name: 'Y2K Women Flared Jeans', slug: 'y2k-women-flared-jeans', description: 'Y2K Women Flared Jeans', order: 22, icon: '🦋' },
    { name: 'Wrangler', slug: 'wrangler', description: 'Wrangler', order: 23, icon: '🤠' },
    { name: 'Lee', slug: 'lee', description: 'Lee', order: 24, icon: '🤠' },
    { name: 'Laguna Beach Jean', slug: 'laguna-beach-jean', description: 'Laguna Beach Jean', order: 25, icon: '🏖️' },
    { name: 'Jeans', slug: 'jeans', description: 'Jeans', order: 26, icon: '👖' },
    { name: 'Shorts', slug: 'shorts', description: 'Shorts', order: 27, icon: '🩳' },
    { name: 'Mini Skirt', slug: 'mini-skirt', description: 'Mini Skirt', order: 28, icon: '👗' },
    { name: 'Women Shorts', slug: 'women-shorts', description: 'Women Shorts', order: 29, icon: '🩳' },
];

