import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

    // 3. Validar Tipo de Archivo (Imágenes y Documentos)
    const validMimeTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "image/gif", 
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
      "application/x-zip-compressed",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Sube imágenes (JPG, PNG, WEBP) o documentos (PDF, Word, Excel, ZIP)." },
        { status: 400 }
      );
    }

    // 4. Validar Tamaño Máximo (15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el límite de 15MB." },
        { status: 400 }
      );
    }

    // 5. Subir a Cloudinary usando nuestro helper
    const secure_url = await uploadToCloudinary(file);

    // Devolver la respuesta con la URL segura de Cloudinary
    return NextResponse.json({ url: secure_url });
  } catch (error) {
    console.error("Error al subir archivo a Cloudinary:", error);
    return NextResponse.json(
      { error: "Lo sentimos, hubo un problema al subir el archivo." },
      { status: 500 }
    );
  }
}
