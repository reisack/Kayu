import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Product from '../classes/product';
import RelatedProductsService from '../services/related-products-service';
import RelatedProduct from './related-product';

interface Props {
  category: string;
  productTotalScore: number;
}

const RelatedProductList: React.FC<Props> = ({category, productTotalScore}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>([]);

  const relatedProductsService = new RelatedProductsService();

  const getRelatedproducts = async (
    category: string,
    productTotalScore: number,
  ): Promise<void> => {
    const relatedProducts = await relatedProductsService.getRelatedproducts(
      category,
      productTotalScore,
    );
    setData(relatedProducts);
    setLoading(false);
  };

  useEffect(() => {
    getRelatedproducts(category, productTotalScore);
  }, [category, productTotalScore]);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        data.map((product: Product) => {
          return <RelatedProduct key={product.eanCode} product={product} />;
        })
      )}
    </View>
  );
};

export default RelatedProductList;
