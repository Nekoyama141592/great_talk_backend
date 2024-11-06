import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { S3 } from 'aws-sdk';
import { updateAWSConfig } from '../utils/updateAWSConfig';

interface PutObjectRequest {
  image: string;
  bucket: string;
  object: string;
}

interface PutObjectResponse {
  bucket: string;
  object: string;
}

export const putObjectV2 = onCall(async (request) => {
  const { auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Please authenticate.');
  }
  updateAWSConfig();
  const s3 = new S3();
  try {
    const { image, bucket }: PutObjectRequest = request.data;
    if (!image || !bucket) {
      throw new HttpsError('invalid-argument', 'Missing required parameters');
    }
    
    const key = `${auth.uid}/profile.jpg`;
    const buffer = Buffer.from(image, 'base64');

    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    await s3.putObject(params).promise();

    const response: PutObjectResponse = {
      bucket,
      object: key
    };

    return response;
  } catch (error) {
    console.error('putObjectV2', error);
    throw new HttpsError('internal', 'Internal Server Error');
  }
});
