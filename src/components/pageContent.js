
import { chart } from './Chart'
import UpdateButton from './UpdateButton'
import GetData from './GetData'
import SelectChartType from './SelectChartType'

export default function PageContent(parentId){
    let app = document.getElementById(parentId);

    let chartId = 'chartcontainer';
    let myChart = chart(app, chartId)

    UpdateButton(app, myChart, { title: 'title1' })

    SelectChartType(app, myChart)

    GetData(app, myChart)
}
