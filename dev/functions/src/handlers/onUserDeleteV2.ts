import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";
import { deleteFromColRef } from '../utils/deleteFromColRef';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
export const onUserDeleteV2 = onDocumentDeleted(
    userPath,
    async (event) => {
        const doc = event.data;
        if (!doc) return;
        const uid = doc.id;
        const myRef = doc.ref;
        await Promise.all([
            // 自分をPostを消す
            deleteFromColRef(myRef.collection('posts')),
            // 自分のtimelineを消す
            deleteFromColRef(myRef.collection('timelines')),
            // 自分のuserUpdateLogsを消す
            deleteFromColRef(myRef.collection('userUpdateLogs')),
            // privateUserを削除
            admin.firestore().collection('private/v1/privateUsers').doc(uid).delete()
        ]);
    }
);