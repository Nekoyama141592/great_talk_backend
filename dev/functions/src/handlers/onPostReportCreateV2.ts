//onPostReportCreateV2
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
const userPath = "public/{version}/users/{uid}";
const postPath = `${userPath}/posts/{postId}`;
export const onPostReportCreateV2 = onDocumentCreated(
    `${postPath}/postReports/{postReport}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        await newValue.postRef.update({
            "reportCount": admin.firestore.FieldValue.increment(1),
        });
    }
);