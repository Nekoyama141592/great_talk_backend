import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";
const postPath = `${userPath}/posts/{postId}`;
export const onPostMessageCreateV2 = onDocumentCreated(
    `${postPath}/senders/{senderUid}/messages/{activeUid}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        await newValue.postRef.update({
            "msgCount": admin.firestore.FieldValue.increment(1),
        });
    }
);