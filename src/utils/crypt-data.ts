import CryptoJS from 'crypto-js';

const secretKey = 'YeC39RLYvA';

export const encrypt = (data: string): string => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export const decrypt = (encryptedData: string): string => {
   try {
        return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
   } catch (error) {
        return "";
   }
}