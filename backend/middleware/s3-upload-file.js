import aws from "aws-sdk"
import multer from "multer"
import multerS3 from "multer-s3"
import multerSharp from "multer-sharp-s3"
import path from "path"
import crypto from "crypto"
const { Access_Key_ID, Secret_Access_Key, BUCKET_NAME } = process.env;
const s3 = new aws.S3({ accessKeyId: Access_Key_ID, secretAccessKey: Secret_Access_Key, Bucket: BUCKET_NAME });

const getFileKey = (file, folder) => {
  if (!file) return false;
  const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + path.extname(file.originalname);
  return `digrowfa/${folder}/${name}`;
};

const s3Storage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file, "courses"))
});
export const s3LessonStorage= multer({ storage: s3Storage });

const s3Storagecourse = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"user"))
});
export const s3StorageCourse= multer({ storage: s3Storagecourse });


const s3StoragetutorProfile = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"user"))
});
export const s3StorageTutorProfile= multer({ storage: s3StoragetutorProfile });


const s3StorageBlogpost = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"blog"))
});
export const s3StorageBlogPost= multer({ storage: s3StorageBlogpost });


const s3Storagewebinar = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"webinar"))
});
export const s3StorageWebinar= multer({ storage: s3Storagewebinar });

const s3Storagecategory = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"webinar"))
});
export const s3StorageCategory= multer({ storage: s3Storagecategory });

const s3Storageworkshop = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  key: (req, file, cb) => cb(null, getFileKey(file,"user"))
});
export const s3StorageWorkshop= multer({ storage: s3Storageworkshop });

const s3StorageComp = multerSharp({
  s3: s3,
  Bucket: BUCKET_NAME,
  Key: (req, file, cb) => crypto.pseudoRandomBytes(16, (err, raw) => cb(err, err ? undefined : raw.toString('hex') + path.extname(file.originalname))),
  ACL: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  //metadata: (req, file, callBack) => callBack(null, { fieldName: file.fieldname }),
  serverSideEncryption: "AES256",
  cacheControl: "max-age=31536000",
  withMetadata: true,
  // multiple: true,
  // resize: [
  //   { suffix: 'md', width: 500, height: 500 },
  //   { suffix: 'sm', width: 300, height: 300 },
  //   { suffix: 'original' },
  // ],
  toFormat: { type: 'jpeg', options: { progressive: true, quality: 40 } },
});

