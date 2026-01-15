import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
} from '@ionic/react';

import { camera } from 'ionicons/icons';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery();

  return (
    <IonPage>
      {/* Header หลัก (เอา translucent ออก ป้องกันแถบซ้อน) */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Header แบบ Large Title (iOS style) */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Student Info */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <IonChip color="primary">
            <IonLabel>
              Lab 05 · นภัสกร ชัยเกตุ · 663380602-5
            </IonLabel>
          </IonChip>

          <IonText color="medium">
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Tap the camera button to take a photo  
              <br />
            </p>
          </IonText>
        </div>

        {/* Photo Grid */}
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg
                  src={photo.webviewPath}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Floating Action Button (Camera) */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="primary" onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
