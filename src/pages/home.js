import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from "react-i18next";

const Home = ({ navigation }) => {

    const { t } = useTranslation();

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
                <Text>{t('welcomeTitle')}</Text>
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