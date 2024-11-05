import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";

export const onUserMutesDeleteV2 = onDocumentDeleted(
    `${userPath}/userMutes/{activeUid}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        await newValue.passiveUserRef.update({
            "muteCount": admin.firestore.FieldValue.increment(-1),
        });
    }
);