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
