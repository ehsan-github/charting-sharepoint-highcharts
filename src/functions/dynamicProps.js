import * as R from 'ramda';
import Highcharts from 'highcharts';

let  mapIndexed = R.addIndex(R.map);
export const buildXAxis = (xAxis, data, drill ) => {
    return (!drill)
        ? { xAxis: {
            categories: pickProp(xAxis, data),
            title: { text: '' },
            crosshair: false,
            tickmarkPlacement: 'on',
            lineWidth: 0
        } }
        : {
            xAxis : {
                type: 'category',
                tickInterval: 1,
                title: { rotation: 90 }
            }
        };
};


export const buildChartType = (type, polar ) => {
    if (type == 'pie') {
        return {
            type,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 600
        };
    } else {
        return {
            polar,
            type
        };
    }
}

export const buildPlotOptions  = (type, showInLegend) => {
    if (type == 'drilldown') {
        return {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}',
                    style: {
                        direction: 'rtl',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    useHTML: true,
                    connectorColor: 'silver'
                }
            }
        };
    } else {
        return {

            pie: {
                allowPointSelect: true,
                showInLegend,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: 'black !important',
                        direction: 'rtl',
                        fill: 'black !important',
                    },
                    useHTML: true,
                }
            }
        }
    }
}

export const buildYAxis = mapIndexed((yAxis, index) => {
    return { // Primary yAxis
        labels: {
            format: `{value}${yAxis.format}`,
            style: {
                color: Highcharts.getOptions().colors[index]
            }
        },
        title: {
            text: yAxis.text,
            style: {
                color: Highcharts.getOptions().colors[index]
            },
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            reversed: false
        },
        opposite: index % 2 == 1
    };
});

const pickProp = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq
)(data);

export const buildTooltip = R.cond([
    [R.equals('line'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.y:,.1f}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: ltr;float:right;">{point.y:,.1f}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('bar'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.y:,.1f}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: ltr;float:right;">{point.y:,.1f}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('pie'), R.always({ tooltip: {
        useHTML: true,
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        style: { direction: 'rtl' }
    } })],
    [R.equals('column'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa";><div style="font-size:10px;font-weight:bold;padding-right:5px;text-align: right;">{point.y:,.1f}</div></div>',
        pointFormat: '<div><span style="float:right;">{series.name}:  </span><div style="text-align: left;direction: ltr;float:right;">{point.y:,.1f}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('curve'), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa"><div style="font-size:10px;font-weight:bold;padding-left:30%">{point.y:,.1f}</div></div><table>',
        pointFormat: '<div><span style="float:left;">{series.name}: </span><div style="text-align: left;direction: ltr;float:left;">{point.y:,.1f}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
    [R.equals('drilldown'), R.always({ tooltip: {
        useHTML: true,
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color};direction=rtl;float=right">{point.name}</span>: <b>{point.y:.2f}</b> <br/>'
    } })],
    [R.equals(''), R.always({ tooltip: {
        headerFormat: '<div style="width:100%;border:1px solid #aaa"><div style="font-size:10px;font-weight:bold;padding-left:30%">{point.y:,.1f}</div></div><table>',
        pointFormat: '<div><span style="float:left;">{series.name}: </span><div style="text-align: left;direction: ltr;float:left;">{point.y:,.1f}</div></div>',
        valueSuffix: '',
        useHTML: true,
        style: { direction: 'rtl' }
    } })],
]);
