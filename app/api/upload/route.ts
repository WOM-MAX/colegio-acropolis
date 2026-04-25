import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Validar Autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para subir archivos." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo." },
        { status: 400 }
      );
    }

    // 2. Verificar que sea un archivo válido
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "El dato enviado no es un archivo válido." },
        { status: 400 }
      );
    }

    // 3. Validar Tipo de Archivo (Solo Imágenes)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes (JPEG, PNG, WEBP, GIF, SVG)." },
        { status: 400 }
      );
    }

    // 4. Validar Tamaño Máximo (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el límite de 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Subir a Cloudinary usando un Stream
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "colegio_acropolis", // Carpeta en Cloudinary
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Error desconocido al subir a Cloudinary"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Devolver la respuesta con la URL segura de Cloudinary
    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error al subir archivo a Cloudinary:", error);
    return NextResponse.json(
      { error: "Lo sentimos, hubo un problema al subir el archivo." },
      { status: 500 }
    );
  }
}
