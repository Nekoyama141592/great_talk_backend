import * as admin from 'firebase-admin';
import { CollectionReference } from 'firebase-admin/firestore';

export const deleteFromColRef = async (colRef: CollectionReference) => {
    const db = admin.firestore();
    // firestore
    const batchLimit = 500;
    const qshot = await colRef.get();
    let count = 0;
    let batch = db.batch();

    for (const doc of qshot.docs) {
        batch.delete(doc.ref);
        count++;

        if (count === batchLimit) {
            await batch.commit();
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
    }
}