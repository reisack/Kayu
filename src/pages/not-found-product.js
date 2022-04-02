import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native'

const NotFoundProduct = ( {navigation} ) => {
    return (
        <ScrollView>
            <View>
                <Text>Le produit n'a pas été trouvé</Text>
            </View>
            <View>
                <Button title='Accueil' onPress={() => navigation.navigate('Home')} />
            </View>
            <View>
                <Button title='Scanner un autre code-barres' onPress={() => navigation.navigate('BarcodeScanner')} />
            </View>
        </ScrollView>
    );
};

export default NotFoundProduct;