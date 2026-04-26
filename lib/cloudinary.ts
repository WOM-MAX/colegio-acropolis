import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyfo4ujkl',
  api_key: process.env.CLOUDINARY_API_KEY || '637693411755352',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ce-RGavRMl-xiSJw_xURvMyg2DU',
});

export async function uploadToCloudinary(file: File, folder: string = "colegio_acropolis"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Error uploading to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}
