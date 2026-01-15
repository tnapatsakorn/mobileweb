import {
  Camera,
  CameraResultType,
  CameraSource,
  CameraDirection,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { useState, useEffect } from 'react';

/* -------------------- */
/* Type ของรูปภาพ */
/* -------------------- */
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

/* key สำหรับเก็บรูปใน Preferences */
const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  /* โหลดรูปที่เคยบันทึกไว้ตอนเปิดแอป */
  useEffect(() => {
    loadSaved();
  }, []);

  /* 📸 เปิดกล้อง */
  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      direction: CameraDirection.Rear, // ✅ กล้องหลัง (ไม่กลับด้าน)
      quality: 80,
    });

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await savePicture(cameraPhoto, fileName);

    const newPhotos = [savedFile, ...photos];
    setPhotos(newPhotos);

    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos),
    });
  };

  /* 💾 บันทึกรูปลง Filesystem */
  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await convertBlobToBase64(blob)) as string;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  /* 🔄 โหลดรูปที่บันทึกไว้ */
  const loadSaved = async () => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    const photos = (value ? JSON.parse(value) : []) as UserPhoto[];
    setPhotos(photos);
  };

  return {
    photos,
    takePhoto,
  };
}

/* 🔧 helper: แปลง Blob → Base64 */
const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
