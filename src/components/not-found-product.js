import React from 'react';
import {View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

const NotFoundProduct = () => {
  const {t} = useTranslation();

  return (
    <View>
      <Text>{t('notFoundProduct')}</Text>
    </View>
  );
};

export default NotFoundProduct;
