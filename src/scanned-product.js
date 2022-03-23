import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native'

const ScannedProduct = ( {eanCode} ) => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const getProductByEanCode = async (eanCode) => {
        try {
            const productDetailsUrl = 'https://fr.openfoodfacts.org/api/v0/product/';
            const response = await fetch(`${productDetailsUrl}${eanCode}.json`);
            const json = await response.json();
            setData(getSimplifiedObject(json));
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getSimplifiedObject = (jsonFromAPI) => {
        const product = jsonFromAPI.product;

        return {
            frName: product.product_name_fr,
            brands: product.brands,
            genericFrName: product.generic_name_fr,
            nutriscoreGrade: product.nutriscore_grade,
            imageHeight: product.images.front_fr.sizes["200"].h,
            imageWidth: product.images.front_fr.sizes["200"].w,
            imageUrl: product.image_front_url,
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
                    <Text>{data.genericFrName}</Text>
                    <Text>Nutriscore : {data.nutriscoreGrade}</Text>
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