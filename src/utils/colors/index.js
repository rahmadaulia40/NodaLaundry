
const TheStrom= {
    primary : '#555A54',
    secondary : '#F7F2EF',
    tertiary : '#E1DDD2',
    fourth : '#BFBBAF',
    success : '#0BCAD4',
    error : '#E06379',
    
}
const color = TheStrom
export const colors = {
    background : color.secondary,
    primary : color.primary,
    secondary : color.tertiary,
    tertiary : color.fourth,
    white : color.secondary,
    black : color.primary,
    disable : color.fourth,
    text : {
        primary : color.primary,
        secondary : color.fourth,
        menuInactive : color.fourth,
        menuActive : color.primary,
        subTitle: color.secondary
    },
    button : {
        primary :{
            background : color.primary,
            text : color.secondary
        },
        secondary : {
            background : color.secondary,
            text : color.primary
        },
        disable : {
            background : color.tertiary,
            text : color.fourth
        }
    },
    border : {
        onFocus : color.primary,
        onBlur : color.fourth
    },
    cardLight : color.secondary,
    loadingBackground : color.primary,
    success : color.success,
    error : color.error
};