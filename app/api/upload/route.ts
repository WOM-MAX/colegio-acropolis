import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";

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
    
    // Crear un nombre de archivo único
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const fileName = `${Date.now()}-${sanitizedName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Asegurarse de que el directorio exista
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    
    // Escribir el archivo en disco
    await fs.writeFile(filePath, buffer);
    
    // Devolver la respuesta con la URL
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Lo sentimos, hubo un problema al subir el archivo." },
      { status: 500 }
    );
  }
}
