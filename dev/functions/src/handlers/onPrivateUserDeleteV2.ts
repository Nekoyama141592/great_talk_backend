import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { deleteFromColRef } from '../utils/deleteFromColRef';
const privateUserPath = "private/{version}/privateUsers/{uid}";
export const onPrivateUserDeleteV2 = onDocumentDeleted(
    privateUserPath,
    async (event) => {
        const doc = event.data;
        if (!doc) return;
        await deleteFromColRef(doc.ref.collection('tokens'));
    }
);