import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import * as R from 'ramda'

import { setTitle, setSubTitle } from './staticProps'

Exporting(Highcharts);

export default function buildChart(app, series, ...x){

    let chartcontainer = document.createElement('div');
    const chartId = 'chartcontainer'
    chartcontainer.setAttribute('id', chartId);

    app.appendChild(chartcontainer);

    // set different chart props
    let title = setTitle('Solar Employment Growth by Sector, 2010-2016');

    let subTitle = setSubTitle('Source: thesolarfoundation.com');

    if (series.length == 0) {
        series = {
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        };
    }
    let remaining = {
        chart: { type: 'bar' },
        yAxis: {
            title: {
                text: 'هزینه پروژه'
            },
            reversed: false
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        // plotOptions: {
        //     series: {
        //         label: {
        //             connectorAllowed: false
        //         },
        //         pointStart: 2010
        //     }
        // },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }

    // merge all chat props together

    let chartProps = R.mergeAll([title, subTitle, series, remaining, ...x])

    return Highcharts.chart(chartId, chartProps)
}
