import { useState, useContext, useRef, useCallback, useEffect } from "react";
import { AppContext } from '../../App'
import GenericChart from '../echarts/GenericChart'

function PieChart(props){
    const [data, setData] = useState()
    const app = useContext(AppContext)
    const id = useRef('')

    const getDefs = useCallback(() => {
        const defs = {
            'By Product Subgroup':{
                dimension: 'Product Group Desc',
                measure: 'Sum([Sales Margin Amount])'
            },
            'By State':{
                dimension: 'state_name',
                measure: 'Sum ([Sales Amount])'
            },
            'By Sales Rep':{
                dimension: 'Sales Rep Name',
                measure: 'Sum ([Budget Amount])'
            },
        }

        return defs[props.title]
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        app.createCube({
            qInitialDataFetch: [
                {
                    qHeight: 4999,
                    qWidth: 2
                }
            ],
            qDimensions: [
                {
                    qDef:{
                        qFieldDefs: [getDefs().dimension]
                    }
                }
            ],
            qMeasures: [
                {
                    qDef:{
                        qDef: getDefs().measure
                    },
                    qSortBy:{
                        qSortByNumeric: -1
                    },
                }
            ],
            qSuppressZero: false,
            qSuppressMissing: false,
            qInterColumnSortOrder: [1,0],
        }, (reply) => {
            console.log('Pie Chart', props.title, reply)

            const matrix = reply.qHyperCube.qDataPages[0].qMatrix

            const data = matrix.map((row) => {
                return {name: row[0].qText, value: row[1].qNum}
            })

            console.log('data', data)

            const totalValue = data.reduce((acum, curr) => acum + curr.value, 0)
            const treshold = props.minAngle / 360 * totalValue

            
            const others = {name: 'Others', value: 0}
            let dataFiltered = []

            data.forEach((row) => {
                if(row.value < treshold){
                    others.value += row.value
                } else{
                    dataFiltered.push(row)
                }
            })

            dataFiltered.push(others)
            id.current = reply.qInfo.qId
            setData(dataFiltered)
        })

        return () => {
            app.destroySessionObject(id.current)
        }
    }, [props.minAngle, props.title, app, getDefs])


    const getOption = () => {
        const option = {
            title: {
              text: props.title,
              textStyle:{
                  color: 'white',
                  fontWeight: 'normal'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            color: [
                "#3b49ee",
                "#89f2f2",
                "#4191e1",
                "#2d669d",
                "#a4d2ff"
            ],
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderColor: 'rgba(0,9,118,1)',
                    borderWidth: 8
                },
                label: {
                  show: true,
                  position: 'outside',
                  color: 'white'
                },
                labelLine: {
                  show: false
                },
                data: data
              }
            ]
          };
          
          return option
    }

    if (!data) return 'Carregando'

    return (
        <GenericChart option = {getOption()} />
    )

}

export default PieChart