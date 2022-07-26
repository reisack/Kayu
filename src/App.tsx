import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './pages/home';
import BarcodeScanner from './pages/barcode-scanner';
import ProductScreen from './pages/product-screen';
import AdditiveInformationsService from './services/additive-informations-service';
import {ToastAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const {t} = useTranslation();

  useEffect(() => {
    AdditiveInformationsService.initAdditiveScoreInformations().catch(() => {
      ToastAndroid.show(
        t<string>('error.initAdditiveScoreInformations'),
        ToastAndroid.LONG,
      );
    });
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
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
