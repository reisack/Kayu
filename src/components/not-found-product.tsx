import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

const NotFoundProduct: React.FC = () => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    message: {
      paddingTop: 16,
      paddingLeft: 16,
      fontSize: 16,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View>
      <Text style={styles.message}>{t<string>('notFoundProduct')}</Text>
    </View>
  );
};

export default NotFoundProduct;
