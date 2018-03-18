import '../assets/global.css';
import * as R from 'ramda';
import Highcharts from 'highcharts';
// import update from '../updates';
import { getSpItems, getAddressItems } from '../api';

import { Data } from '../Data';

import chartBuilder  from '../functions/buildChart';
import SelectFilter from './SelectFilter';
import MultiSelectFilter from './MultiSelectFilter';
import { buildXAxis } from '../functions/dynamicProps';
import Elem from '../elements/Element';

import { COLORS } from '../constants/index'

export default function PageContent(parentId){
    let app = document.getElementById(parentId);
    // let myChart = null;

    let chartItems = window.CHART_ITEMS || [];
    let dataSource = window.DATA_SOURCE  || '';

    // let address = window.ADDRESS || 'GetWeeklyOperation,null,null,null';
    // let address = window.ADDRESS || 'GetStatusPC,null,null,null,null';
    let chartType = window.CHART_TYPE || 'donut';
    let yAxis = window.Y_AXIS || 'NetworkFinal' ||
        [
            { name: 'ContractID', dispName: 'سیب', type: 'line' },
            { name: 'Flag', type: 'line', index: 1 }
        ] || [
            { name: 'تیر 96', type: 'column' },
            { name: 'اردیبهشت 96', type: 'column' },
            { name: 'مهر96', type: 'column' },
            { name: 'خرداد 96', type: 'line', index: 1 },
            { name: 'آبان 96', type: 'line', index: 1 },
        ];
    let { xAxis, drill = null, aggFunc = 'Sum' } = { xAxis: 'ContractName', drill: 'Area', aggFunc: 'Sum' };
    let filterItems = window.FILTER_ITEMS || [
        { name: 'Status', dispName: 'وضعیت', multi: false },
    ];

    let address = window.ADDRESS || '';
    // let chartType = window.CHART_TYPE || 'column';
    // let yAxis = window.Y_AXIS || [];
    // let { xAxis, drill = null, aggFunc = 'Sum' } = window.X_AXIS || {};
    // let filterItems = window.FILTER_ITEMS || [];

    let legend = window.LEGEND || null ;
    let renamings = window.RENAMINGS || {};

    let xAxisProps = buildXAxis(xAxis, chartItems, drill);
    let filters = buildFilters(filterItems);


    let setItems = items => {
        chartItems = stringReplacement(renamings, items);
        let { chartSeries, chartData } = buildChartData(legend, filters, yAxis, xAxis, chartItems, drill, aggFunc, chartType);
        let drillDown = buildDrilldown(xAxis, drill, yAxis, chartData, chartType);
        xAxisProps = buildXAxis(xAxis, chartItems, drill);
        chartBuilder(app, chartType, { series: chartSeries }, drillDown, xAxisProps);
        filters = buildFilters(filterItems);
        // SelectChartType(app, myChart);

        // Add Filters to page
        let filterBox = Elem({ type: 'div', className: 'filters-box' });
        app.appendChild(filterBox);
        let filterHeader = Elem({ type: 'h3', title: 'فیلترها' });
        filterBox.appendChild(filterHeader);
        filterItems.forEach(({ name, dispName, multi })=> {
            let options = getUniqOptions(name, items, multi);
            if (multi) {
                MultiSelectFilter(app, filterBox, { name, dispName, multi }, options);
            } else {
                SelectFilter(app, filterBox, { name, dispName, multi }, options);
            }
        });

        // adding select2 to all selects
        window.jQuery('select').select2()
    }
    app.setItems = setItems;

    // filter functions
    // simple select filter
    let changeFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let { chartSeries, chartData } = buildChartData(legend, filters, yAxis, xAxis, chartItems, drill, aggFunc, chartType);
        let drillDown = buildDrilldown(xAxis, drill, yAxis, chartData, chartType);
        xAxisProps = buildXAxis(xAxis, chartData, drill);
        chartBuilder(app, chartType, { series: chartSeries }, drillDown, xAxisProps);
    };
    app.changeFilter = changeFilter;

    // multi select filter

    let changeMultiFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let { chartSeries, chartData } = buildChartData(legend, filters, yAxis, xAxis, chartItems, drill, aggFunc, chartType);
        let drillDown = buildDrilldown(xAxis, drill, yAxis, chartData, chartType);
        xAxisProps = buildXAxis(xAxis, chartData, drill);
        chartBuilder(app, chartType, { series: chartSeries }, drillDown, xAxisProps);
    };
    app.changeMultiFilter = changeMultiFilter;
    // Get Chart DATA

    if (dataSource == 'SQL'){
        getSpItems(address)
            .then(x => JSON.parse(x))
            .then(items => {
                // console.log(items)
                setItems(items);
            })
            .catch(err => console.log('err: ', err.Message))
        ;

    } else if (dataSource == 'Sharepoint') {
        getAddressItems(address)
            .map(x => JSON.parse(x))
            .fork(
                err     => { console.log('err: ', err.Message) },
                items   => {
                    setItems(items);
                }
            );
    } else {
        setItems(Data);
    }
    //

    // GetData(app, myChart);

}

const buildFilters = R.map(x => {
    let { multi, name } = x;
    return multi ? { name, value: [] } : { name, value: '' };
});

const buildChartData = (legend, filters, yAxis, xAxis, data, drill, aggFunc, type) => {
    let chartData = reduceFilters(filters, xAxis, yAxis)(data);
    if(type == 'pie') {
        let data = R.pipe(
            R.groupBy(R.prop(xAxis)),
            R.map(R.map(R.prop(yAxis))),
            R.map(computeAggFunc(aggFunc)),
            R.mapObjIndexed((value, name)=> {
                return {
                    name,
                    y: value
                };
            }),
            R.values
            // R.sort(R.descend(R.prop('y')))
        )(chartData);
        return {
            chartSeries: [{
                name: xAxis,
                data
            }],
            chartData
        };
    } else if (type == 'donut') {
        let firstSery = R.pipe(
            R.groupBy(R.prop(drill)),
            R.map(R.map(R.prop(yAxis))),
            R.map(R.sum),
            R.mapObjIndexed((val, key)=> { return { name: key, y: val } }),
            R.values,
            arr => arr.map((value, index) => R.assoc('color', COLORS[index], value))
        )(chartData)

        let secondSery = R.pipe(
            R.groupBy(R.prop(drill)),
            R.values,
            R.map(R.map(x => { return { name: x[xAxis], y: x[yAxis] } })),
            arrs => arrs.map((val0, i0)=> val0.map(
                (val1, i1)=> {
                    let drillDataLen = val0.length;
                    let brightness = 0.2 - (i1 / drillDataLen) / 5;

                    return R.assoc(
                        'color',
                        Highcharts.Color(COLORS[i0]).brighten(brightness).get(),
                        val1)
                })),
            R.reduce(R.concat, [])
        )(chartData)

        return {
            chartSeries: [{
                name: drill,
                data: firstSery,
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: '#ffffff',
                    distance: -30
                }
            }, {
                name: xAxis,
                data: secondSery,
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    formatter: function () {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                            this.y + '%' : null;
                    }
                }
            }],
            chartData
        }
    } else {
        if (!drill) {
            if (typeof yAxis == 'string') {
                return {
                    chartSeries: R.pipe(
                        R.groupBy(R.prop(legend)),
                        R.mapObjIndexed((rows, key) => {   // select yAxis from each Group
                            return {
                                name: key == 'undefined' ? '' : key,
                                data: R.map(R.prop(yAxis), rows)
                                // pointPlacement: 'on'
                            };
                        }),
                        R.values
                    )(chartData),
                    chartData
                };
            }
            return {
                chartSeries: R.pipe(
                    buildLegends(yAxis)
                )(chartData),
                chartData
            };
        } else {
            let data = R.pipe(
                R.groupBy(R.prop(drill)),
                R.map(R.map(R.prop(yAxis))),
                R.map(computeAggFunc(aggFunc)),
                R.mapObjIndexed((value, name)=> {
                    return {
                        name,
                        drilldown: name,
                        y: value
                    };
                }),
                R.values,
                R.sort(R.descend(R.prop('y')))
            )(chartData);

            return {
                chartSeries: [{
                    name: drill,
                    colorByPoint: true,
                    data
                }],
                chartData
            };
        }
    }
};

const getUniqOptions = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq,
    R.reject( x => x == null)
    // x => multi ? R.identity(x) : R.prepend('همه', x)
)(data);

const reduceFilters = (filters, xAxis, yAxis) => R.reduce(
    (acc, { name, value }) => {
        if (!isNaN(value)) value = Number(value);
        if (typeof value == 'object') {

            return R.reduce((miniAcc,val) => {
                if (R.propSatisfies(
                    x => value.includes(x),
                    name,
                    val)) {
                    let index = R.findIndex(R.propEq(xAxis, R.prop(xAxis, val)), miniAcc)
                    if (index == -1) {
                        return R.append(val, miniAcc)
                    } else {
                        if (typeof yAxis == 'string') {
                            let oldVal = R.prop(yAxis, val)
                            return R.adjust(R.evolve({ [yAxis]: R.add(oldVal) }), index, miniAcc)
                        } else {
                            return R.reduce((microAcc, miniYAxis) => {
                                let oldVal = R.prop(miniYAxis.name, val)
                                return R.adjust(R.evolve({ [miniYAxis.name]: R.add(oldVal) }), index, microAcc)
                            }, miniAcc, yAxis)
                        }
                    }
                } else {
                    return miniAcc
                }
            }, [], acc)
        } else {
            return value == 'همه' ? acc : R.filter(R.propEq(name, value), acc);
        }
    },
    R.__,
    filters
);

const buildLegends = yAxises => data => R.map(yAxis => { return {
    type: yAxis.type,
    name: yAxis.dispName,
    data: R.map(R.prop(yAxis.name), data),
    yAxis: yAxis.index || 0
    // pointPlacement: 'on'
};}, yAxises);

const stringReplacement = (replacements, data) => R.map(
    R.map(value => R.propOr(value, value, replacements)),
    data);

const buildDrilldown = (xAxis, drill, yAxis, chartData, chartType) => {
    return (chartType !== 'drilldown')
        ? {}
        : {
            drilldown: {
                series: R.pipe(
                    R.groupBy(R.prop(drill)),
                    R.map(R.map(R.pick([yAxis, xAxis]))),
                    R.map(R.sort(R.descend(R.prop(yAxis)))),
                    R.mapObjIndexed((value, name)=> {
                        return {
                            name,
                            id: name,
                            data: R.map(R.props([xAxis, yAxis]), value)
                        };
                    }),
                    R.values
                )(chartData)
            }
        };
}

const computeAggFunc = R.cond([
    [R.equals('Sum'), R.always(R.sum)],
    [R.equals('Avg'), R.always(R.mean)],
    [R.equals('Multi'), R.always(R.product)],
    [R.equals('Min'), R.always(R.reduce(R.min, Number.MAX_SAFE_INTEGER))],
    [R.equals('Max'), R.always(R.reduce(R.max, Number.MIN_SAFE_INTEGER))],
    [R.equals('Count'), R.always(R.length)],
    [R.T, R.always(R.sum)],
])

// const item = { 'AreaID': 1, 'Area': 'دز و کارون', 'ContractID': 255, 'ContractName': '2000 هکتاری اندیمشک', 'Status': 'جاری', 'NetworkFinal': 2029.0, 'DrainageFinal': 0.0, 'EquippedFinal': 0.0, 'ReadyNetwork': 2143.0, 'ReadyDrainage': 0.0, 'ReadyEquipped': 0.0, 'NetworkDoc': 2235.0, 'DraindDoc': 0.0, 'EquipDoc': 0.0, 'CountTemp': 2, 'NetworkDelivered': 2143.0, 'DrainDelivered': 0.0, 'EquippedDelivered': 0.0, 'CountTempDate': 2, 'NetworkDelivered2': 2143.0, 'DrainDelivered2': 0.0, 'EquippedDelivered2': 0.0, 'CountTemp3': null, 'NetworkDelivered3': 0.0, 'DrainDelivered3': 0.0, 'EquippedDelivered3': 0.0, 'NetworkRemove': 0.0, 'DrainRemove': 0.0, 'EquippedRemove': 0.0, 'NetworkFinalDeliver': 0.0, 'DrainFinalDeliver': 0.0, 'EquippedFinalDeliver': 0.0 }
