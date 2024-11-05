import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";
const postPath = `${userPath}/posts/{postId}`;
export const onPostMuteCreateV2 = onDocumentCreated(
    `${postPath}/postMutes/{activeUid}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        await newValue.postRef.update({
            "muteCount": admin.firestore.FieldValue.increment(1),
        });
    }
);