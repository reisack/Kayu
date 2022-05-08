import React from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

interface Props {
  navigation: any;
}

const Home: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
    },
    buttonContainer: {
      paddingTop: 32,
    },
  });

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Text>{t<string>('welcomeTitle')}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t<string>('reactNativeTutorial')}
            onPress={() => navigation.navigate('Tutorial')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t<string>('scanBarcode')}
            onPress={() => navigation.navigate('BarcodeScanner')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
