'use strict';
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'

const Home = ({ navigation }) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24
        },
        buttonContainer: {
            paddingTop: 32
        }
    });

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.container}>
                <Text>Hello World !</Text>
                <View style={styles.buttonContainer}>
                    <Button title='Infos React Native' onPress={() => navigation.navigate('Tutorial')} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title='Scanner un code-barres' onPress={() => navigation.navigate('BarcodeScanner')} />
                </View>
            </View>
        </ScrollView>
    );
}

export default Home;