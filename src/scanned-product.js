'use strict';
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
            imageHeight: product.images.front_fr.sizes["200"].h,
            imageWidth: product.images.front_fr.sizes["200"].w,
            imageUrl: product.image_front_url,
            scores: getScoresFromProduct(product)
        };
    }

    const getScoresFromProduct = (product) => {
        // Fat
        const fat = product.nutriments["fat_100g"] ?? null;
        const saturatedFat = product.nutriments["saturated-fat_100g"] ?? null;

        let fatScore = null;
        if (fat !== null) {
            fatScore = fat * 0.75;
        }
        if (saturatedFat !== null) {
            fatScore += saturatedFat * 0.25;
        }
        if (fatScore !== null) {
            fatScore = fatScore.toFixed(2);
        }

        const sugarScore = product.nutriments["sugars_100g"] ?? null;
        const saltScore = product.nutriments["salt_100g"] ?? null;

        const novaGroup = product.nova_group ?? null;
        let novaGroupScore = null;
        if (novaGroup !== null) {
            novaGroupScore = novaGroup * 25;
        }

        const eco = product.ecoscore_score ?? null;
        let ecoScore;
        if (eco) {
            ecoScore = 100 - eco;
        }
        
        const additives = product.additives_tags || null;
        let additivesScore;
        if (additives) {
            // Todo : Get additives Informations
            const additivesInformations = [];
        }

        return {
            fat: fatScore,
            sugar: sugarScore,
            salt: saltScore,
            novaGroup: novaGroupScore,
            eco: ecoScore,
            additives: additivesScore
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