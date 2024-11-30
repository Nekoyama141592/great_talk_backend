import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { S3 } from 'aws-sdk';
import { updateAWSConfig } from '../utils/updateAWSConfig';

interface PutObjectRequest {
  base64Image: string;
  object: string;
}

interface PutObjectResponse {
  base64Image: string;
}

export const putObjectV2 = onCall(async (request) => {
  const { auth } = request;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Please authenticate.');
  }
  updateAWSConfig();
  const s3 = new S3();
  try {
    const { base64Image,object }: PutObjectRequest = request.data;
    if (!base64Image || !object) {
      throw new HttpsError('invalid-argument', 'Missing required parameters');
    }
    
    const buffer = Buffer.from(base64Image, 'base64');
    const bucket = `${process.env.AWS_S3_BUCKET_NAME}`
    const params = {
      Bucket: bucket,
      Key: object,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    await s3.putObject(params).promise();

    const response: PutObjectResponse = {
      base64Image
    };

    return response;
  } catch (error) {
    console.error('putObjectV2', error);
    throw new HttpsError('internal', 'Internal Server Error');
  }
});
