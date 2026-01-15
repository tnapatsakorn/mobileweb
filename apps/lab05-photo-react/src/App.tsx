import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { images, square, triangle } from 'ionicons/icons';

import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        {/* เนื้อหาของแต่ละ Tab */}
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>

          <Route exact path="/tab2">
            <Tab2 />
          </Route>

          <Route exact path="/tab3">
            <Tab3 />
          </Route>

          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>

        {/* Tab Bar ด้านล่าง */}
        <IonTabBar slot="bottom" className="custom-tabbar">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={triangle} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          {/* ปุ่มตรงกลาง (Photos) */}
          <IonTabButton tab="tab2" href="/tab2" className="center-tab">
            <IonIcon icon={images} />
            <IonLabel>Photos</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={square} />
            <IonLabel>Other</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
