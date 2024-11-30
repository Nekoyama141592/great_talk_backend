import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { S3 } from 'aws-sdk';
import { updateAWSConfig } from '../utils/updateAWSConfig';

interface GetObjectRequest {
  object: string;
}

interface GetObjectResponse {
  base64Image: string;
}

export const getObjectV2 = onCall(async (request) => {
  updateAWSConfig();
  const s3 = new S3();
  try {
    const { object }: GetObjectRequest = request.data;
    if (!object) {
      throw new HttpsError('invalid-argument', 'Missing required parameters');
    }
    const bucket = `${process.env.AWS_S3_BUCKET_NAME}`
    const params = {
      Bucket: bucket,
      Key: object
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
