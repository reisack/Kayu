'use strict';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native'
import getScoresFromProduct from './score-calculation';

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
            imageHeight: product.images.front_fr.sizes["200"].h,
            imageWidth: product.images.front_fr.sizes["200"].w,
            imageUrl: product.image_front_url,
            scores: getScoresFromProduct(product)
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
                    {data.scores.fat !== null && <Text>Gras : {data.scores.fat} g</Text>}
                    {data.scores.sugar !== null && <Text>Sucre : {data.scores.sugar} g</Text>}
                    {data.scores.salt !== null && <Text>Sel : {data.scores.salt} g</Text>}
                    {data.scores.novaGroup !== null && <Text>NOVA : {data.scores.novaGroup}</Text>}
                    {data.scores.eco !== null && <Text>Ecoscore : {data.scores.eco}</Text>}
                    {data.scores.additives !== null && <Text>Addictifs : {data.scores.additives}</Text>}
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