import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native'
import getScoresFromProduct from '../services/score-calculation-service';
import ProgressBar from 'react-native-progress/Bar';

const ScannedProduct = ( {eanCode} ) => {

    const progressBarWidth = 300;
    const progressBarHeight = 20;

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

    const setScoreForProgressBar = (score) => {
        return score / 100.0;
    }

    useEffect(() => {
        getProductByEanCode(eanCode);
    }, [eanCode]);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> : (
                <>
                    <Text>{data.frName} - {data.brands}</Text>
                    {
                        data.scores.fat !== null && 
                        <>
                        <Text>Gras : {data.scores.fat.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.fat)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
                    {
                        data.scores.salt !== null && 
                        <>
                        <Text>Sel : {data.scores.salt.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.salt)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
                    {
                        data.scores.sugar !== null && 
                        <>
                        <Text>Sucre : {data.scores.sugar.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.sugar)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
                    {
                        data.scores.novaGroup !== null && 
                        <>
                        <Text>NOVA : {data.scores.novaGroup.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.novaGroup)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
                    {
                        data.scores.eco !== null && 
                        <>
                        <Text>Eco-score : {data.scores.eco.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.eco)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
                    {
                        data.scores.additives !== null && 
                        <>
                        <Text>Addictifs : {data.scores.additives.toFixed(2)}</Text>
                        <ProgressBar progress={setScoreForProgressBar(data.scores.additives)} width={progressBarWidth} height={progressBarHeight} />
                        </>
                    }
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