import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/pages/home';
import Tutorial from './src/pages/tutorial';
import BarcodeScanner from './src/pages/barcode-scanner';
import ScannedProductScreen from './src/pages/scanned-product-Screen';
import AdditiveInformationsService from './src/services/additive-informations-service';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    AdditiveInformationsService.initAdditiveScoreInformations();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Tutorial"
          component={Tutorial}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScannedProductScreen"
          component={ScannedProductScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
