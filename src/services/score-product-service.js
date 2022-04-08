import productInformationEnum from '../enums/product-information';

const scoreProductService = {
    getExpression: (score, productInfoEnum) => {
        const expressions = {
            [productInformationEnum.fat]: {
                low: 'score.expression.fatLow',
                high: 'score.expression.fatHigh'
            },
            [productInformationEnum.sugar]: {
                low: 'score.expression.sugarLow',
                high: 'score.expression.sugarHigh'
            },
            [productInformationEnum.salt]: {
                low: 'score.expression.saltLow',
                high: 'score.expression.saltHigh'
            },
            [productInformationEnum.additives]: {
                low: 'score.expression.additivesLow',
                high: 'score.expression.additivesHigh'
            },
            [productInformationEnum.novaGroup]: {
                low: 'score.expression.novaGroupLow',
                high: 'score.expression.novaGroupHigh'
            },
            [productInformationEnum.eco]: {
                low: 'score.expression.ecoLow',
                high: 'score.expression.ecoHigh'
            },
        };

        const productExpressions = expressions[productInfoEnum];
        return (score >= 50) ? productExpressions.high : productExpressions.low;
    },
    getHelpMessage: (productInfoEnum) => {
        const expressions = {
            [productInformationEnum.fat]: 'score.help.fat',
            [productInformationEnum.sugar]: 'score.help.sugar',
            [productInformationEnum.salt]: 'score.help.salt',
            [productInformationEnum.additives]: 'score.help.additives',
            [productInformationEnum.novaGroup]: 'score.help.novaGroup',
            [productInformationEnum.eco]: 'score.help.eco'
        };

        return expressions[productInfoEnum];
    }
};

export default scoreProductService;