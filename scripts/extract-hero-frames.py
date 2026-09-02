import cv2
import os
import sys

def extract_frames():
    video_path = os.path.join("public", "VIDEO NUEVO HERO", "VIDEO NUEVO HERO-VERSIÓN 2.mp4")
    output_dir = os.path.join("public", "hero-frames")
    
    if not os.path.exists(video_path):
        print(f"Error: No se encontró el video en {video_path}")
        sys.exit(1)
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Limpiar fotogramas anteriores si existen
    for existing_file in os.listdir(output_dir):
        if existing_file.endswith(".webp"):
            os.remove(os.path.join(output_dir, existing_file))
    
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Iniciando extracción: {total_frames} fotogramas a {fps} FPS ({width}x{height})")
    
    frame_idx = 0
    total_bytes = 0
    
    while True:
        success, frame = cap.read()
        if not success:
            break
            
        frame_filename = f"frame_{frame_idx:03d}.webp"
        frame_path = os.path.join(output_dir, frame_filename)
        
        # Guardar en WebP con calidad 85 (HD balanceado)
        cv2.imwrite(frame_path, frame, [cv2.IMWRITE_WEBP_QUALITY, 85])
        size = os.path.getsize(frame_path)
        total_bytes += size
        
        frame_idx += 1
        if frame_idx % 25 == 0 or frame_idx == total_frames:
            print(f"Procesados {frame_idx}/{total_frames} fotogramas...")
            
    cap.release()
    print(f"Extracción completada con éxito: {frame_idx} fotogramas guardados en {output_dir}")
    print(f"Peso total acumulado: {total_bytes / (1024 * 1024):.2f} MB")

if __name__ == "__main__":
    extract_frames()
