// 基本的な設定
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { detectText } from '../utils/detectText';
import { detectModerationLabels } from '../utils/detectModerationLabels';
const db = admin.firestore();
// firestore
const userPath = "public/{version}/users/{uid}";
const postPath = `${userPath}/posts/{postId}`;
const batchLimit = 500;
export const onPostCreateV2 = onDocumentCreated(
    postPath,
    async (event) => {
        const uid = event.params.uid;
        const doc = event.data;
        const newValue = doc?.data();
        if (!doc || !newValue) return;
        const [detectedDescription, detectedTitle, detectedImage] = await Promise.all([
            detectText(newValue.description.value),
            detectText(newValue.title.value),
            detectModerationLabels(newValue.image.bucketName, newValue.image.value)
        ]);
        await doc.ref.update({
            'description': detectedDescription,
            'title': detectedTitle,
            'image': detectedImage,
        });
        // timelineを作成
        const timeline = {
            "createdAt": newValue.createdAt,
            "isRead": false,
            "posterUid": newValue.uid,
            "postId": newValue.postId,
        };
        const posterRef = db.collection('public/v1/users').doc(uid);
        await posterRef.collection('timelines').doc(newValue.postId).set(timeline); // 投稿者にもSet
        // followersをget
        const followers = await posterRef.collection("followers").get();
        let count = 0;
        let batch = db.batch();
        for (const follower of followers.docs) {
            const data = follower.data();
            // followerのtimelineを作成
            const ref = data.activeUserRef.collection("timelines").doc(newValue.postId);
            batch.set(ref,timeline);
            count++;
            if (count == batchLimit) {
                await batch.commit();
                batch = db.batch();
                count = 0;
            }
        }
        if (count > 0) {
            await batch.commit();
        }
    }
);