const AWS = require("aws-sdk");


const uploadToS3 = async (stringifiedExpenses, fileName) => {
  
    try {
    
        const bucketName = process.env.S3_BUCKET_NAME;
        const s3Key = process.env.S3_IAM_USER_KEY;
        const s3Secret = process.env.S3_IAM_USER_SECRET;

    
        let s3bucket = new AWS.S3({
            accessKeyId: s3Key,
            secretAccessKey: s3Secret,
        });

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: stringifiedExpenses,
            ACL: "public-read",
        };

        const { Location: fileUrl } = await s3bucket.upload(params).promise();
        return fileUrl;

    } catch (err) {
        console.log("Error in uploading expenses data to S3, error: ", JSON.stringify(err));
        throw new Error(err);
    }
    
};

module.exports = { uploadToS3 };
