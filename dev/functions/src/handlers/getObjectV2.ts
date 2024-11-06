import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { S3 } from 'aws-sdk';
import { updateAWSConfig } from '../utils/updateAWSConfig';

interface GetObjectRequest {
  bucketName: string;
  fileName: string;
}

interface GetObjectResponse {
  base64Image: string;
}

export const getObjectV2 = onCall(async (request) => {
  updateAWSConfig();
  const s3 = new S3();
  try {
    const { bucketName, fileName }: GetObjectRequest = request.data;
    if (!bucketName || !fileName) {
      throw new HttpsError('invalid-argument', 'Missing required parameters');
    }

    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    const data = await s3.getObject(params).promise();
    if (!data.Body) {
      throw new HttpsError('not-found', 'File not found');
    }

    const base64Image = data.Body.toString('base64');
    const response: GetObjectResponse = {
      base64Image
    };

    return response;
  } catch (error) {
    console.error('getObjectV2', error);
    throw new HttpsError('internal', 'Internal Server Error');
  }
});
