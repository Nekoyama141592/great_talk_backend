import * as AWS from 'aws-sdk';
import { updateAWSConfig } from './updateAWSConfig';
export const detectModerationLabels = async (bucketName: string, fileName: string) => {
    updateAWSConfig();
    const rekognition = new AWS.Rekognition();
    let detectedImage = {
        "bucketName": bucketName,
        "moderationLabels": <AWS.Rekognition.ModerationLabels>[],
        "moderationModelVersion": '',
        "value": fileName,
    };

    if (!bucketName || !fileName) {
        return detectedImage;
    }

    try {
        const params = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: fileName,
                },
            },
            MinConfidence: 60,
        };

        const moderationLabelsResponse = await rekognition.detectModerationLabels(params).promise();
        const labels = moderationLabelsResponse.ModerationLabels || [];
        const version = moderationLabelsResponse.ModerationModelVersion || '';
        if (labels && version) {
            detectedImage = {
                "bucketName": bucketName,
                "moderationLabels": labels,
                "moderationModelVersion": version,
                "value": fileName,
            };
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return detectedImage;
}