import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { AppData } from './types';

const firebaseConfig = {
    apiKey: "AIzaSyDqSSg4clScLnKxVtdv_vFA-mO3512XoxY",
    authDomain: "monthflow.firebaseapp.com",
    projectId: "monthflow",
    storageBucket: "monthflow.firebasestorage.app",
    messagingSenderId: "191028375194",
    appId: "1:191028375194:web:adb7ddaa5dab6a6eb33923"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DOC_ID = 'main-schedule';

export async function loadDataFromFirestore(): Promise<AppData | null> {
    try {
        const docRef = doc(db, 'schedules', DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as AppData;
        }
        return null;
    } catch (error) {
        console.error('Firestore 데이터 로드 실패:', error);
        return null;
    }
}

export async function saveDataToFirestore(data: AppData): Promise<boolean> {
    try {
        const docRef = doc(db, 'schedules', DOC_ID);
        await setDoc(docRef, data);
        console.log('✅ Firestore에 저장됨');
        return true;
    } catch (error) {
        console.error('Firestore 저장 실패:', error);
        return false;
    }
}

export { db };
