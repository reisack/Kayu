import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

const NotFoundProduct: React.FC = () => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    message: {
      paddingTop: 16,
      paddingLeft: 16,
      fontSize: 24,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    // https://www.flaticon.com/free-icon/sad-face-in-rounded-square_42901
    notFoundImage: {
      width: 128,
      height: 128,
      alignSelf: 'center',
      marginVertical: 32,
    },
  });

  return (
    <View>
      <Image
        style={styles.notFoundImage}
        source={require('../../assets/images/sad.png')}
      />
      <Text style={styles.message}>{t<string>('notFoundProduct')}</Text>
    </View>
  );
};

export default NotFoundProduct;
