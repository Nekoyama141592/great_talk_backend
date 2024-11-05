import { onDocumentCreated } from 'firebase-functions/v2/firestore';
const userPath = "public/{version}/users/{uid}";
import { detectText } from '../utils/detectText';
import { detectModerationLabels } from '../utils/detectModerationLabels';
export const onUserUpdateLogCreateV2 = onDocumentCreated(
    `${userPath}/userUpdateLogs/{id}`,
    async (event) => {
        const newValue = event.data?.data();
        if (!newValue) return;
        const userRef = newValue.userRef;

        const oldUser = await userRef.get();
        const oldUserJson = oldUser.data();
        const detectedUserName = {
            "languageCode": "",
            "negativeScore": 0,
            "positiveScore": 0,
            "sentiment": "",
            "value": newValue.stringUserName,
        };
        const newBio = newValue.stringBio;
        const detectedBio = (newBio === oldUserJson['bio']['value']) ? oldUserJson['bio'] : await detectText(newBio);
        const newImage = newValue.image;
        const newBucketName = newImage.bucketName;
        const newFileName = newImage.value;
        const detectedImage = (newFileName === oldUserJson['image']['value']) ? oldUserJson['image'] : await detectModerationLabels(newBucketName,newFileName);
        await userRef.update({
            'bio': detectedBio,
            'image': detectedImage,
            'searchToken': newValue.searchToken,
            'userName': detectedUserName,
        });
    }
);