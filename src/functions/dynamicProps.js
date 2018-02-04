import * as R from 'ramda';

export const buildXAxis = (xAxis, data) => {
    return { xAxis: { categories: pickProp(xAxis, data), crosshair: false } };
};


const pickProp = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq
)(data);
