import React from 'react';
import {View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

const NotFoundProduct: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t<string>('notFoundProduct')}</Text>
    </View>
  );
};

export default NotFoundProduct;
