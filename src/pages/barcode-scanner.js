import React, { useEffect, useState } from 'react';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { StyleSheet, View, Text } from 'react-native'
import { useIsFocused } from "@react-navigation/native";

const BarcodeScanner = ({ navigation }) => {

    const styles = StyleSheet.create({
        container: {
          flex: 1
        },
        preview: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center'
        },
        overlay: {
          position: 'absolute',
          padding: 16,
          right: 0,
          left: 0,
          alignItems: 'center'
        },
        topOverlay: {
          top: 0,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        scanScreenMessage: {
          fontSize: 16,
          color: 'white',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center'
        }
    });

    const isFocused = useIsFocused();
    const [productHasBeenScanned, setProductHasBeenScanned] = useState(false);

    const onBarcodeRead = (scanResult) => {
      if (!productHasBeenScanned && scanResult && scanResult.data) {
        setProductHasBeenScanned(true);
        navigation.navigate('ScannedProductScreen', {
          eanCode: scanResult.data
        });
      }
    }

    useEffect(() => {
      setProductHasBeenScanned(false);
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <RNCamera
              captureAudio={false}
              type={RNCamera.Constants.Type.back}
              style={styles.preview}
              onBarCodeRead={onBarcodeRead.bind(this)}
            >
              <BarcodeMask showAnimatedLine={false} width={300} height={300} />
            </RNCamera>
            <View style={[styles.overlay, styles.topOverlay]}>
                <Text style={styles.scanScreenMessage}>Scanne un code-barres stp.</Text>
            </View>
        </View>
    );
}

export default BarcodeScanner;