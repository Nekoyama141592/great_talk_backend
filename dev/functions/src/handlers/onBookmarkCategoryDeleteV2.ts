// 基本的な設定
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { deleteFromColRef } from '../utils/deleteFromColRef';

export const onBookmarkCategoryDeleteV2 = onDocumentDeleted(
    'private/{version}/privateUsers/{uid}/bookmarkCategories/{categoryId}',
    async (event) => {
        const ref = event.data?.ref.collection('bookmarks');
        // カテゴリー下のブックマークを全て削除
        if (ref) {
            await deleteFromColRef(ref);
        }
    }
);