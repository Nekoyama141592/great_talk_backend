// 基本的な設定
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
// firestore
const userPath = "public/{version}/users/{uid}";
export const onFollowerCreateV2 = onDocumentCreated(
    `${userPath}/followers/{followerUid}`,
    async (event) => {
        const newValue = event.data?.data();
        const batch = admin.firestore().batch();
        
        if (newValue?.activeUserRef && newValue?.passiveUserRef) {
            batch.update(newValue.activeUserRef, {
                'followingCount': admin.firestore.FieldValue.increment(1),
            });
            batch.update(newValue.passiveUserRef, {
                'followerCount': admin.firestore.FieldValue.increment(1), 
            });
        }
        
        await batch.commit();
    }
);