import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';
const { Configuration, OpenAIApi } = require('openai');
import AWS from 'aws-sdk';
import prisma from '../../../lib/prisma';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { imgUrl, doGenerate } = req.body;

    if (!imgUrl) {
      return res.status(500).json({ message: 'No image provided' });
    }
    if (!imgUrl && doGenerate) {
      try {
        const config = new Configuration({
          apiKey: process.env.OPENAI_KEY,
        });
        const openai = new OpenAIApi(config);
        const response = await openai.createImage({
          prompt: description ?? item,
          n: 1,
          size: '512x512',
        });
        const s3 = new AWS.S3({
          accessKeyId: process.env.AMZ_ACCESS_KEY,
          secretAccessKey: process.env.AMZ_SECRET_ACCESS_KEY,
        });

        const imgRes = await fetch(response.data.data[0].url);
        const arrBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrBuffer);
        const uploadedImg = await s3
          .upload({
            Bucket: process.env.AMZ_S3_BUCKET_NAME,
            Key: item + Date.now() + '.png',
            Body: buffer,
          })
          .promise();
        imgUrl = uploadedImg.Location;
      } catch (e) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else if (e.message) {
          console.log(e.message);
        } else {
          console.log(e);
        }
        imgUrl = null;
      }
    }
  }
}
