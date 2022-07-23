import React from 'react';
import {View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const NotFoundProduct: React.FC = () => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    message: {
      paddingTop: width * 0.0625,
      paddingLeft: width * 0.0625,
      fontSize: 24 * fontScale,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: width * 0.0625,
    },
    // https://www.flaticon.com/free-icon/sad-face-in-rounded-square_42901
    notFoundImage: {
      width: width * 0.33,
      height: width * 0.33,
      alignSelf: 'center',
      marginVertical: width * 0.125,
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
