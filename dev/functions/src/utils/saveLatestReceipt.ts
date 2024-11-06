// 基本的な設定
import * as admin from 'firebase-admin';
export const saveLatestReceipt = async (latestReceipt: any,uid: string,transactionID: string,isIos: Boolean) => {
    const db = admin.firestore();
    const transactionsPath = isIos ? "iosTransactions" : "androidTransactions";
    const transactionColRef = db.collection(`private/v1/privateUsers/${uid}/${transactionsPath}`);
    const newTransactionsPath = isIos ? "newIosTransactions" : "newAndroidTransactions";
    const newTransactionsColRef = db.collection(newTransactionsPath);
    const oldTx = await transactionColRef.doc(transactionID).get();
    if (!oldTx.exists) {
       const batch = db.batch();
       batch.set(transactionColRef.doc(transactionID), latestReceipt);
       batch.set(newTransactionsColRef.doc(transactionID), latestReceipt);
       await batch.commit();
    }
}