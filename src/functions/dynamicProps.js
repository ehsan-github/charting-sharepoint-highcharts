import * as R from 'ramda';

export const buildXAxis = (xAxis, data) => {
    return { xAxis: {
        categories: pickProp(xAxis, data),
        title: { text: xAxis },
        crosshair: false,
        tickmarkPlacement: 'on',
        lineWidth: 0
    } };
};


const pickProp = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq
)(data);

export const buildTooltip = R.cond([
    [R.equals('line'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.key}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: rtl;float:right;">{point.y}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('bar'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.key}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: rtl;float:right;">{point.y}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('pie'), R.always({ tooltip: {
        useHTML: true,
        pointFormat: '<b> ' + 'tooltipLable' + '{point.y:,.0f}</b><br/></b> %  {point.percentage:.2f}</b>'
    } })],
    [R.equals('column'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.key}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: rtl;float:right;">{point.y}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('curve'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa"><div style="font-size:10px;font-weight:bold;padding-left:30%">{point.key}</div></div><table>',
        pointFormat: '<div><span style="float:left;">{series.name}: </span><div style="text-align: left;direction: ltr;float:left;">{point.y}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('drilldown'), R.always({ tooltip: {
        formatter: function(){
            return this.key + ' : ' + this.y;
        },
        rtl: true, useHTML: true
    } })]
]);
