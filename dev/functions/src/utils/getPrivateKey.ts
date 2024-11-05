import { chunkSplit } from "./chunkSplit";
export const getPrivateKey = (privateKey: string) => {
    const key  = chunkSplit(privateKey, 64, '\n');
    const pkey = '-----BEGIN PRIVATE KEY-----\n' + key + '-----END PRIVATE KEY-----\n';

    return pkey;
}