import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";

export const onUserMutesCreateV2 = onDocumentCreated(
    `${userPath}/userMutes/{activeUid}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        await newValue.postRef.update({
            "muteCount": admin.firestore.FieldValue.increment(1),
        });
    }
);