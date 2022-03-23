import React from 'react';
import { View, Button, ScrollView, StyleSheet } from 'react-native'
import ScannedProduct from './scanned-product'

const ScannedProductScreen = ({ route, navigation }) => {

    const styles = StyleSheet.create({
        buttonContainer: {
            marginTop: 32,
            paddingHorizontal: 8
        }
    });

    const { eanCode } = route.params;

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View>
                <Button styles={styles.buttonContainer} title='Home' onPress={() => navigation.navigate('Home')} />
                <Button title='Scan other product' onPress={() => navigation.navigate('BarcodeScanner')} />
            </View>
            <ScannedProduct eanCode={JSON.stringify(eanCode)} />
        </ScrollView>
    );
}

export default ScannedProductScreen;