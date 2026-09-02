import cv2
import numpy as np
import os

def clean_watermarks():
    clean_img_path = os.path.join("public", "images", "COELGIO DE NOCHE SIN MARCA DE AGUA.jpeg")
    frames_dir = os.path.join("public", "hero-frames")
    
    if not os.path.exists(clean_img_path):
        print(f"Error: No se encontró la imagen limpia en {clean_img_path}")
        return
        
    clean_img = cv2.imread(clean_img_path)
    if clean_img is None:
        print("Error al cargar la imagen limpia.")
        return
        
    # Redimensionar la imagen limpia exactamente a 1284x716
    clean_resized = cv2.resize(clean_img, (1284, 716), interpolation=cv2.INTER_LANCZOS4)
    
    # Crear máscara de suavizado (feathering) para la esquina inferior derecha
    mask = np.zeros((716, 1284), dtype=np.float32)
    # Región donde se ubica la marca de agua (x: 1140..1284, y: 630..716)
    mask[630:716, 1140:1284] = 1.0
    # Difuminar bordes para una transición imperceptible
    mask = cv2.GaussianBlur(mask, (25, 25), 0)
    mask_3d = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    
    # Región de referencia circundante limpia para calibrar luminancia y color
    # (Pavimento adyacente sin marca: y: 600..716, x: 950..1130)
    ref_y1, ref_y2 = 600, 716
    ref_x1, ref_x2 = 950, 1130
    clean_ref = clean_resized[ref_y1:ref_y2, ref_x1:ref_x2].astype(np.float32)
    
    cleaned_count = 0
    
    for idx in range(35): # Revisar y limpiar fotogramas 0 a 34
        frame_filename = f"frame_{idx:03d}.webp"
        frame_path = os.path.join(frames_dir, frame_filename)
        
        if not os.path.exists(frame_path):
            continue
            
        frame = cv2.imread(frame_path)
        if frame is None:
            continue
            
        # Calcular factor de escala de color/luz del fotograma actual relativo a la imagen base
        frame_ref = frame[ref_y1:ref_y2, ref_x1:ref_x2].astype(np.float32)
        scale = (frame_ref.mean(axis=(0, 1)) + 1e-5) / (clean_ref.mean(axis=(0, 1)) + 1e-5)
        
        # Ajustar la imagen limpia al tono y brillo exacto de este fotograma
        clean_adjusted = np.clip(clean_resized.astype(np.float32) * scale, 0, 255).astype(np.float32)
        
        # Mezcla alfa con bordes difuminados
        blended = (clean_adjusted * mask_3d + frame.astype(np.float32) * (1.0 - mask_3d))
        blended = np.clip(blended, 0, 255).astype(np.uint8)
        
        # Guardar en WebP con calidad 85
        cv2.imwrite(frame_path, blended, [cv2.IMWRITE_WEBP_QUALITY, 85])
        cleaned_count += 1
        
    print(f"Limpieza completada: {cleaned_count} fotogramas corregidos con éxito.")

if __name__ == "__main__":
    clean_watermarks()
