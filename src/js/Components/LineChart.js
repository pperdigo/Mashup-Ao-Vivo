import { useState, useContext, useRef, useCallback, useEffect } from "react";
import { AppContext } from '../../App'
import GenericChart from '../echarts/GenericChart'

function LineChart(props){
    const [data, setData] = useState()
    const [axisData, setAxisData] = useState()
    const app = useContext(AppContext)
    const id = useRef('')

    const getDefs = useCallback(() => {
        const defs = {
            'Margin Amount Over Time':{
                dimension: 'Month',
                measure: 'Sum([Sales Margin Amount])'
            },
            'Sales Over Time':{
                dimension: 'Month',
                measure: 'Sum ([Sales Amount])'
            },
            'Budget Over Time':{
                dimension: 'Month',
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
                        qFieldDefs: [getDefs().dimension],
                        qSortCriterias: [
                            {
                              qSortByNumeric: 1,
                            }
                          ]
                    }
                }
            ],
            qMeasures: [
                {
                    qDef:{
                        qDef: getDefs().measure
                    },
                }
            ],
            qSuppressZero: false,
            qSuppressMissing: false,
            qInterColumnSortOrder: [0,1],
        }, (reply) => {
            const matrix = reply.qHyperCube.qDataPages[0].qMatrix

            const data = []
            const axisData = []

            matrix.forEach((row) => {
                axisData.push(row[0].qText)
                data.push(row[1].qNum)
            })

            setData(data)
            setAxisData(axisData)
        })

        return () => {
            app.destroySessionObject(id.current)
        }
    }, [props.title, app, getDefs])


    const getOption = () => {
        const option = {
            title:{
              text: props.title,
              textStyle: {
                color: 'white'
              }
            },
            xAxis: {
              type: 'category',
              data: axisData,
              axisLabel: {
                color: 'white'
              }
            },
            yAxis: {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: 'grey',
                  opacity: 0.3
                }
              },
              axisLabel: {
                color: 'white',
                formatter: (value) => {
                    return (value/1000000).toLocaleString('pt-BR', {maximumFractionDigits: 1}) + ' M'
                }
              },
              min: (value) => {
                return value.min - 100000
              }
            },
            series: [
              {
                data: data,
                type: 'line',
                itemStyle:{
                    opacity: 0
                }
              }
            ]
          }
          
          return option
    }

    if (!data) return 'Carregando'

    return (
        <GenericChart option = {getOption()} />
    )

}

export default LineChart