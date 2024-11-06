import type { AxiosResponse } from 'axios';

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import axios from 'axios';
import { saveLatestReceipt } from '../utils/saveLatestReceipt';

const IOS_PKG_NAME = `${process.env.IOS_PKG_NAME}`;
const RECEIPT_VERIFICATION_ENDPOINT_SANDBOX = "https://sandbox.itunes.apple.com/verifyReceipt";
const RECEIPT_VERIFICATION_ENDPOINT_FOR_IOS_PROD = "https://buy.itunes.apple.com/verifyReceipt";

export const verifyIOSReceiptV2 = onCall(async (request) => {
  const RECEIPT_VERIFICATION_PASSWORD_FOR_IOS = `${process.env.APP_SHARED_SECRET}`;
  const purchaseDetails = request.data;

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication information is not available in the request context');
  }

  const uid: string = request.auth.token.uid;
  const verificationData = purchaseDetails.verificationData.serverVerificationData;

  if (!verificationData) {
    throw new HttpsError('invalid-argument', 'Missing verification data');
  }

  let response: AxiosResponse;

  try {
    response = await axios.post(RECEIPT_VERIFICATION_ENDPOINT_FOR_IOS_PROD, {
      "receipt-data": verificationData,
      "password": RECEIPT_VERIFICATION_PASSWORD_FOR_IOS,
      "exclude-old-transactions": true,
    });
    if (response.data && response.data.status === 21007) {
      response = await axios.post(RECEIPT_VERIFICATION_ENDPOINT_SANDBOX, {
        "receipt-data": verificationData,
        "password": RECEIPT_VERIFICATION_PASSWORD_FOR_IOS,
        "exclude-old-transactions": true,
      });
    }
  } catch (err) {
    throw new HttpsError('internal', 'Failed to verify receipt');
  }

  const result = response.data;

  if (result.status !== 0) {
    throw new HttpsError('permission-denied', 'Invalid receipt');
  }

  if (!result.receipt || result.receipt.bundle_id !== IOS_PKG_NAME) {
    throw new HttpsError('permission-denied', 'Invalid bundle ID');
  }
  const latestReceipt = result.latest_receipt_info[0];
  if (!latestReceipt) {
    throw new HttpsError('internal', 'Latest receipt is undefined.');
  }
  // 期限内であることを確認する
  const now = Date.now();
  const expireDate = Number(latestReceipt.expires_date_ms);
  if (now < expireDate) {
      const transactionID = latestReceipt.transaction_id;
      const result = {...latestReceipt,uid}
      await saveLatestReceipt(latestReceipt,uid,transactionID,true);
      return { result };
  } else {
    throw new HttpsError('permission-denied', 'This receipt is expired.');
  }
});