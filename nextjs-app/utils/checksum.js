import crypto from 'crypto';
export async function calculateSHA256(fileBuffer) {
  try {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);

    const hexDigest = hashSum.digest('hex');
    return hexDigest;
  } catch (error) {
    console.error('Error calculating SHA-256:', error);
    return null;
  }
}
