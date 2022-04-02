import productInformationEnum from '../enums/product-information';

const scoreProductService = {
    getExpression: (score, productInfoEnum) => {
        const expressions = {
            [productInformationEnum.fat]: {
                low: 'Tout sec',
                high: 'Le gras c\'est la vie'
            },
            [productInformationEnum.sugar]: {
                low: 'Radin',
                high: 'Sugar Daddy'
            },
            [productInformationEnum.salt]: {
                low: 'Rabat-joie',
                high: 'Le sel, c\'est aussi la vie'
            },
            [productInformationEnum.additives]: {
                low: 'On se fait chier...',
                high: 'Plein d\'additifs, plein de fun !'
            },
            [productInformationEnum.novaGroup]: {
                low: 'Aucune originalité',
                high: 'Super-héros'
            },
            [productInformationEnum.eco]: {
                low: 'Casanier',
                high: 'Globe-trotteur'
            },
        };

        const productExpressions = expressions[productInfoEnum];
        return (score >= 50) ? productExpressions.high : productExpressions.low;
    },
    getHelpMessage: (nutritionValue, productInfoEnum) => {
        const expressions = {
            [productInformationEnum.fat]: `${nutritionValue}g de gras pour 100g de produit`,
            [productInformationEnum.sugar]: `${nutritionValue}g de sucre pour 100g de produit`,
            [productInformationEnum.salt]: `${nutritionValue}g de sel pour 100g de produit`,
            [productInformationEnum.additives]: `${nutritionValue.length ?? 0} addictifs`,
            [productInformationEnum.novaGroup]: `Score NOVA : ${nutritionValue} (Transformation des aliments)`,
            [productInformationEnum.eco]: `Eco score : ${nutritionValue} (Empreinte carbone)`
        };

        return expressions[productInfoEnum];
    }
};

export default scoreProductService;