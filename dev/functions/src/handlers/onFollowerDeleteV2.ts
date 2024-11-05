// 基本的な設定
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
// firestore
const userPath = "public/{version}/users/{uid}";
const minusOne = -1;
export const onFollowerDeleteV2 = onDocumentDeleted(
    `${userPath}/followers/{followerUid}`,
    async (event) => {
        const newValue = event.data?.data();
        const batch = admin.firestore().batch();
        
        if (newValue?.activeUserRef && newValue?.passiveUserRef) {
            batch.update(newValue.activeUserRef, {
                'followingCount': admin.firestore.FieldValue.increment(minusOne),
            });
            batch.update(newValue.passiveUserRef, {
                'followerCount': admin.firestore.FieldValue.increment(minusOne),
            });
        }
        
        await batch.commit();
    }
);