import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet } from 'react-native'
import ScannedProduct from '../components/scanned-product'
import NotFoundProduct from '../components/not-found-product';

const ScannedProductScreen = ({ route, navigation }) => {

    const styles = StyleSheet.create({
        buttonContainer: {
            paddingHorizontal:24,
            paddingTop: 32
        }
    });

    const { eanCode } = route.params;

    const [productCouldBeFound, setProductCouldBeFound] = useState(true);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            {productCouldBeFound 
                ? <ScannedProduct eanCode={JSON.stringify(eanCode)} onNotFoundProduct={() => setProductCouldBeFound(false)} />
                : <NotFoundProduct />}
            <View style={styles.buttonContainer}>
                <Button styles={styles.buttonContainer} title='Accueil' onPress={() => navigation.navigate('Home')} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title='Scanner un autre code-barres' onPress={() => navigation.navigate('BarcodeScanner')} />
            </View>
        </ScrollView>
    );
}

export default ScannedProductScreen;