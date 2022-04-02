import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import ProgressBar from 'react-native-progress/Bar';
import scoreProductService from '../services/score-product-service';

const ScoreProduct = ( {score, nutritionValue, productInfoEnum} ) => {
    const progressBarWidth = 200;
    const progressBarHeight = 20;

    const styles = StyleSheet.create({
        container: {
            padding: 8,
            paddingHorizontal: 24,
            marginHorizontal: 24,
            backgroundColor: score >= 50 ? '#14c258' : '#c72400',
            marginTop: 8
        },
        section: {
            marginTop: 8
        },
        helpButton: {
            width: 32,
            height: 32
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
                        <Text>
                            <View>
                                <ProgressBar progress={getScoreForProgressBar()} width={progressBarWidth} height={progressBarHeight} />
                            </View>
                            <View style={styles.helpButton}>
                                <Button title='?' onPress={() => Alert.alert('Informations', scoreProductService.getHelpMessage(nutritionValue, productInfoEnum))} />
                            </View>
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text>{scoreProductService.getExpression(score, productInfoEnum)}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ScoreProduct;