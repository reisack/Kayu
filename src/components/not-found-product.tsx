import React from 'react';
import {View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import Consts from '../consts';

const NotFoundProduct: React.FC = () => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    message: {
      paddingTop: width * Consts.style.scaleFactor.oneSixteenth,
      paddingLeft: width * Consts.style.scaleFactor.oneSixteenth,
      fontSize: 24 * fontScale,
      textAlign: 'left',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: width * Consts.style.scaleFactor.oneSixteenth,
    },
    // https://www.flaticon.com/free-icon/sad-face-in-rounded-square_42901
    notFoundImage: {
      width: width * Consts.style.scaleFactor.third,
      height: width * Consts.style.scaleFactor.third,
      alignSelf: 'center',
      marginVertical: width * Consts.style.scaleFactor.oneEighth,
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
