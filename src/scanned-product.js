import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'

const ScannedProduct = ( {EANCode} ) => {

    const styles = StyleSheet.create({
        pictureProduct: {
            width: 200,
            height: 200
        }
    });

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const getProductByEANCode = async (EANCode) => {
        try {
            const productDetailsUrl = 'https://fr.openfoodfacts.org/api/v0/product/';
            const response = await fetch(`${productDetailsUrl}${EANCode}.json`);
            const json = await response.json();
            setData(json);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProductByEANCode(EANCode);
    }, [EANCode]);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> : (
                <>
                    <Text>{data.product.product_name_fr} - {data.product.brands}</Text>
                    <Text>{data.product.generic_name_fr}</Text>
                    <Text>Nutriscore : {data.product.nutriscore_grade}</Text>
                    <Image style={styles.pictureProduct} source={{uri: data.product.image_front_url}} />
                </>
            )}
        </View>
    );
}

export default ScannedProduct