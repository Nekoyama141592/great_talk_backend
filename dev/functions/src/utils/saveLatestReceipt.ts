// 基本的な設定
import * as admin from 'firebase-admin';
import { saveDataToFirestore } from './saveDataToFirestore';
export const saveLatestReceipt = async (latestReceipt: any,uid: string,transactionID: string,isIos: Boolean) => {
    const db = admin.firestore();
    const transactionsPath = isIos ? "iosTransactions" : "androidTransactions";
    const transactionColRef = db.collection('private/v1/privateUsers').doc(uid).collection(transactionsPath);
    const newTransactionsPath = isIos ? "newIosTransactions" : "newAndroidTransactions";
    const newTransactionsColRef = db.collection(newTransactionsPath);
    const oldTx = await transactionColRef.doc(transactionID).get();
    // 存在しないなら非同期でFirestoreに保存。
    if (!oldTx.exists) {
       await Promise.all([
        saveDataToFirestore(latestReceipt, transactionColRef,transactionID),
        saveDataToFirestore(latestReceipt, newTransactionsColRef,transactionID)
       ]);
    }
}