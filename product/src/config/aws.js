const { S3Client } = require('@aws-sdk/client-s3');

// AWS SDK v3 automatically handles IRSA credentials
// No manual credential configuration needed!

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1'
});

const s3Config = {
  bucket: process.env.S3_BUCKET_NAME,
  region: process.env.AWS_REGION || 'ap-south-1'
};

// Debug logs
console.log('AWS SDK v3 S3Client configured');
console.log('Region:', process.env.AWS_REGION || 'ap-south-1');
console.log('Bucket:', process.env.S3_BUCKET_NAME);

module.exports = { s3, s3Config };
