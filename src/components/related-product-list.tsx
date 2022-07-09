import React, {useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Product from '../classes/product';
import RelatedProductsService from '../services/related-products-service';
import RelatedProduct from './related-product';

interface Props {
  originProductEanCode: string;
  category: string;
  productTotalScore: number;
}

const RelatedProductList: React.FC<Props> = ({
  originProductEanCode,
  category,
  productTotalScore,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>([]);

  const relatedProductsService = new RelatedProductsService();
  const isMounted = useRef(true);

  const getRelatedproducts = async (
    category: string,
    productTotalScore: number,
  ): Promise<void> => {
    const relatedProducts = await relatedProductsService.getRelatedproducts(
      category,
      productTotalScore,
    );
    if (isMounted.current) {
      setData(relatedProducts);
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current && getRelatedproducts(category, productTotalScore);
  }, [category, productTotalScore]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        data.map((product: Product) => {
          return (
            <RelatedProduct
              originProductEanCode={originProductEanCode}
              key={product.eanCode}
              product={product}
            />
          );
        })
      )}
    </View>
  );
};

export default RelatedProductList;
