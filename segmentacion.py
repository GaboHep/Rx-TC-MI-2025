import cv2
import numpy as np
from pathlib import Path

# 📁 Rutas (ajustadas sin tilde)
ruta_originales = Path("C:/Users/ggabo/OneDrive/Documentos/ESPOL/Tesis/DATASET/SEGMENTACION/data/CXR_Png")
ruta_mascaras = Path("C:/Users/ggabo/OneDrive/Documentos/ESPOL/Tesis/DATASET/SEGMENTACION/data/Masks_Segmentadas_Torax")
ruta_salida = Path("C:/Users/ggabo/OneDrive/Documentos/ESPOL/Tesis/DATASET/SEGMENTACION/data/segmentadas_torax")

ruta_salida.mkdir(parents=True, exist_ok=True)

extensiones = [".png", ".jpg", ".jpeg", ".JPG", ".JPEG", ".PNG"]

for mask_path in sorted(ruta_mascaras.glob("*_mask.png")):
    nombre_base = mask_path.stem.replace("_mask", "")
    imagen_original = None

    for ext in extensiones:
        posible_path = ruta_originales / f"{nombre_base}{ext}"
        if posible_path.exists():
            imagen_original = posible_path
            break

    if not imagen_original:
        print(f"❌ Imagen original no encontrada para: {nombre_base}")
        continue

    img = cv2.imread(str(imagen_original), cv2.IMREAD_GRAYSCALE)
    mask = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)

    if img is None:
        print(f"❌ No se pudo leer la imagen: {imagen_original}")
        continue
    if mask is None:
        print(f"❌ No se pudo leer la máscara: {mask_path}")
        continue

    if img.shape != mask.shape:
        print(f"⚠️ Tamaños diferentes para: {nombre_base}, redimensionando máscara...")
        mask = cv2.resize(mask, (img.shape[1], img.shape[0]))

    mask_binaria = (mask > 127).astype(np.uint8)
    img_segmentada = np.where(mask_binaria == 1, img, 255).astype(np.uint8)

    salida_path = ruta_salida / f"{nombre_base}_segmentada.png"
    cv2.imwrite(str(salida_path), img_segmentada)
    print(f"✅ Segmentada guardada: {salida_path.name}")
