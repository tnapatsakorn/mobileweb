import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="about-box">
          <h2>Photo Gallery App</h2>

          <ul>
            <li>ถ่ายภาพด้วย Camera</li>
            <li>แสดงภาพแบบ Grid</li>
            <li>บันทึกภาพลงเครื่อง</li>
            <li>โหลดภาพเมื่อเปิดแอป</li>
          </ul>

          <p>พัฒนาโดย Ionic React + Capacitor</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;