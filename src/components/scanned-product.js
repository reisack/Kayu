import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native'
import getScoresFromProduct from '../services/score-calculation-service';
import ScoreProduct from './score-product';
import productInformationEnum from '../enums/product-information';

const ScannedProduct = ( {eanCode, onNotFoundProduct} ) => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const getProductByEanCode = async (eanCode) => {
        try {
            const productDetailsUrl = 'https://fr.openfoodfacts.org/api/v0/product/';
            const response = await fetch(`${productDetailsUrl}${eanCode}.json`);
            const json = await response.json();
            if (json && json.status && json.status === 1) {
                setData(getSimplifiedObject(json));
                setLoading(false);
            }
            else {
                onNotFoundProduct();
            }
        } catch(error) {
            console.error(error);
            onNotFoundProduct();
        }
    }

    const getSimplifiedObject = (jsonFromAPI) => {
        const product = jsonFromAPI.product;

        const nutritionValues = {
            fat: product.nutriments["saturated-fat_100g"] ?? null,
            sugar: product.nutriments["sugars_100g"] ?? null,
            salt: product.nutriments["salt_100g"] ?? null,
            additives: product.additives_tags ?? null,
            novaGroup: product.nova_group ?? null,
            eco: product.ecoscore_score ?? null,
        };

        return {
            frName: product.product_name_fr,
            brands: product.brands,
            imageHeight: product.images.front_fr.sizes["200"].h,
            imageWidth: product.images.front_fr.sizes["200"].w,
            imageUrl: product.image_front_url,
            nutritionValues: nutritionValues,
            scores: getScoresFromProduct(nutritionValues)
        };
    }

    useEffect(() => {
        getProductByEanCode(eanCode);
    }, [eanCode]);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> : (
                <>
                    <Text>{data.frName} - {data.brands}</Text>
                    <ScoreProduct
                        score={data.scores.fat}
                        nutritionValue={data.nutritionValues.fat}
                        productInfoEnum={productInformationEnum.fat}
                    />
                    <ScoreProduct
                        score={data.scores.salt}
                        nutritionValue={data.nutritionValues.salt}
                        productInfoEnum={productInformationEnum.salt}
                    />
                    <ScoreProduct
                        score={data.scores.sugar}
                        nutritionValue={data.nutritionValues.sugar}
                        productInfoEnum={productInformationEnum.sugar}
                    />
                    <ScoreProduct
                        score={data.scores.novaGroup}
                        nutritionValue={data.nutritionValues.novaGroup}
                        productInfoEnum={productInformationEnum.novaGroup}
                    />
                    <ScoreProduct
                        score={data.scores.eco}
                        nutritionValue={data.nutritionValues.eco}
                        productInfoEnum={productInformationEnum.eco}
                    />
                    <ScoreProduct 
                        score={data.scores.additives} 
                        nutritionValue={data.nutritionValues.additives}
                        productInfoEnum={productInformationEnum.additives}
                    />
                    <Image 
                        style={{width: data.imageWidth, height: data.imageHeight}}
                        source={{uri: data.imageUrl}}
                    />
                </>
            )}
        </View>
    );
}

export default ScannedProduct