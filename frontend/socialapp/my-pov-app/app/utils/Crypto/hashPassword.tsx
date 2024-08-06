import CryptoJS from 'crypto-js';

const hashPassword = (password: string): string => {
  const hashedPassword = CryptoJS.SHA256(password).toString();
  return hashedPassword;
};

export default hashPassword;
