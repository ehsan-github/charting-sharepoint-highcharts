
import * as R from 'ramda'
// import update from '../updates'

import chartBuilder  from '../functions/buildChart'
import GetData from './GetData'
import SelectFilter from './SelectFilter'

export default function PageContent(parentId){
    let app = document.getElementById(parentId);
    let chartItems = []
    let yAxis = 'ConsultantUserId'
    let legend = 'Title'
    let filterItems = ['Status']
    let filters = R.map(x => { return { name: x, value: 'همه' } }, filterItems)
    let chartSeries = buildChartData(legend, filters, yAxis, chartItems)

    let myChart = chartBuilder(app, { series: chartSeries })

    let setItems = items => {
        chartItems = items
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems)
        myChart = chartBuilder(app, { series: chartSeries })

        // Build Selects
        filterItems.forEach(item => {
            let options = getUniqOptions(item, items)
            SelectFilter(app, item, options)
        })

    }
    app.setItems = setItems

    let changeFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters)
        filters[index] = R.assoc('value', value, filters[index])
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems)
        myChart = chartBuilder(app, { series: chartSeries })
    }
    app.changeFilter = changeFilter

    GetData(app, myChart)
}

const buildChartData = (legend, filters, yAxis, data) => R.pipe(
    R.groupBy(R.prop(legend)),
    R.map(
        row => R.reduce(
            (acc, { name, value }) => value == 'همه' ? acc : R.filter(R.propEq(name, value), acc),
            row,
            filters)),
    R.reject(x => R.length(x) == 0),
    R.mapObjIndexed((rows, key) => {
        return {
            name: key,
            data: R.map(R.prop(yAxis), rows)
        }
    }),
    R.values
)(data)

const getUniqOptions = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq,
    R.reject( x => x == null),
    R.prepend('همه')
)(data)
