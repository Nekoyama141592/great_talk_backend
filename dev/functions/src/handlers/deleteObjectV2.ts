import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { S3 } from 'aws-sdk';
import { updateAWSConfig } from '../utils/updateAWSConfig';

interface DeleteObjectRequest {
  bucketName: string;
  fileName: string;
}

interface DeleteObjectResponse {
  image: string;
}

export const deleteObjectV2 = onCall(async (request) => {
  updateAWSConfig();
  const s3 = new S3();
  try {
    const { bucketName, fileName }: DeleteObjectRequest = request.data;
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

    await s3.deleteObject(params).promise();

    const base64Image = data.Body.toString('base64');
    const response: DeleteObjectResponse = {
      image: base64Image
    };

    return response;
  } catch (error) {
    console.error('deleteObjectV2', error);
    throw new HttpsError('internal', 'Internal Server Error');
  }
});
