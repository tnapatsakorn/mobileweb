import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react';

import { camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { useState, useEffect } from 'react';

const Tab2: React.FC = () => {

  const [photos, setPhotos] = useState<any[]>([]);

  // 📸 ถ่ายรูป
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const fileName = new Date().getTime() + '.jpeg';

    const savedFile = await savePhoto(photo, fileName);

    const newPhotos = [savedFile, ...photos];
    setPhotos(newPhotos);

    // 💾 save list
    await Preferences.set({
      key: 'photos',
      value: JSON.stringify(newPhotos)
    });
  };

  // 💾 save ลงเครื่อง
  const savePhoto = async (photo: any, fileName: string) => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    const base64Data = await convertBlobToBase64(blob) as string;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  };

  // 🔁 แปลงไฟล์
  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  // 🔄 โหลดรูปตอนเปิดแอป
  const loadPhotos = async () => {
    const { value } = await Preferences.get({ key: 'photos' });

    if (value) {
      setPhotos(JSON.parse(value));
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>

<IonContent fullscreen>

  <div className="profile-box">
    <h2>ชื่อ: นภัสกร ชัยเกตุ</h2>
    <p>รหัสนักศึกษา: 663380602-5</p>
  </div>

  {/* 🖼️ grid */}
  <div className="photo-grid">
    {photos.map((p, index) => (
      <img key={index} src={p.webviewPath} />
    ))}
  </div>

  {/* 📷 ปุ่ม */}
  <IonFab vertical="bottom" horizontal="center" slot="fixed">
    <IonFabButton onClick={takePhoto}>
      <IonIcon icon={camera} />
    </IonFabButton>
  </IonFab>

</IonContent>
    </IonPage>
  );
};

export default Tab2;