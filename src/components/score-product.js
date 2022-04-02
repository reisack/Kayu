import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import ProgressBar from 'react-native-progress/Bar';
import scoreProductService from '../services/score-product-service';

const ScoreProduct = ( {score, dataFromAPI, productInfoEnum} ) => {
    const progressBarWidth = 250;
    const progressBarHeight = 20;

    const styles = StyleSheet.create({
        container: {
            padding: 8,
            paddingHorizontal: 24,
            marginHorizontal: 24,
            backgroundColor: '#9FA8DA',
            marginTop: 8
        },
        section: {
            marginTop: 8
        }
    });

    const getScoreForProgressBar = () => {
        return score / 100.0;
    }

    return (
        <View>
            {score === null ? <View></View> : (
                <View style={styles.container}>
                <View style={styles.section}>
                    <ProgressBar progress={getScoreForProgressBar()} width={progressBarWidth} height={progressBarHeight} />
                </View>
                <View style={styles.section}>
                    <Text>{scoreProductService.getExpression(score, productInfoEnum)} ({dataFromAPI})</Text>
                </View>
                </View>
            )}
        </View>
    );
};

export default ScoreProduct;