import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native'

const Home = ({ navigation }) => {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View>
                <Text>Hello World !</Text>
                <Button title='Tutorial' onPress={() => navigation.navigate('Tutorial')} />
            </View>
        </ScrollView>
    );
}

export default Home;