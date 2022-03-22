import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native'
import ScannedProduct from './scanned-product';

const Home = ({ navigation }) => {

    const EANCode = '3228857000166';

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View>
                <Text>Hello World !</Text>
                <Button title='Tutorial' onPress={() => navigation.navigate('Tutorial')} />
            </View>
            <ScannedProduct EANCode={EANCode} />
        </ScrollView>
    );
}

export default Home;