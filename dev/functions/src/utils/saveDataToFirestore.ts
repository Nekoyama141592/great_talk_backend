import { CollectionReference } from 'firebase-admin/firestore';
export const saveDataToFirestore = (json: any, colRef: CollectionReference, id: string) => {
    return colRef.doc(id).set(json);
}
