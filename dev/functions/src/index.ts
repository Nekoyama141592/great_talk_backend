import * as admin from 'firebase-admin';
admin.initializeApp();

export { onBookmarkCategoryDeleteV2 } from './handlers/onBookmarkCategoryDeleteV2';
export { onFollowerCreateV2 } from './handlers/onFollowerCreateV2';
export { onFollowerDeleteV2 } from './handlers/onFollowerDeleteV2';
export { onPostCreateV2 } from './handlers/onPostCreateV2';
export { onPostLikeCreateV2 } from './handlers/onPostLikeCreateV2';
export { onPostLikeDeleteV2 } from './handlers/onPostLikeDeleteV2';
export { onPostMessageCreateV2 } from './handlers/onPostMessageCreateV2';
export { onPostMuteCreateV2 } from './handlers/onPostMuteCreateV2';
export { onPostMuteDeleteV2 } from './handlers/onPostMuteDeleteV2';
export { onPostReportCreateV2 } from './handlers/onPostReportCreateV2';
export { onPrivateUserDeleteV2 } from './handlers/onPrivateUserDeleteV2';