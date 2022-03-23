import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'

const Home = ({ navigation }) => {

    const styles = StyleSheet.create({
        buttonContainer: {
            marginTop: 32,
            marginBottom: 32,
            paddingHorizontal: 8
        }
    });

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View>
                <Text>Hello World !</Text>
                <View styles={styles.buttonContainer}>
                    <Button title='Tutorial' onPress={() => navigation.navigate('Tutorial')} />
                </View>
                <View styles={styles.buttonContainer}>
                    <Button title='Scan product' onPress={() => navigation.navigate('BarcodeScanner')} />
                </View>
            </View>
        </ScrollView>
    );
}

export default Home;