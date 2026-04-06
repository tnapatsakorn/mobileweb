import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="home-box">
          <h2>Mobile Web Application</h2>
          <p>Lab 05: Photo Gallery</p>

          <h3>ชื่อ: นภัสกร ชัยเกตุ</h3>
          <p>รหัส: 663380602-5</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;