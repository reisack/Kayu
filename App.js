import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/home';
import Tutorial from './src/tutorial';
import BarcodeScanner from './src/barcode-scanner';
import ScannedProductScreen from './src/scanned-product-Screen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tutorial" component={Tutorial} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
        <Stack.Screen name="ScannedProductScreen" component={ScannedProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;