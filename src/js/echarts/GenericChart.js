import * as echarts from 'echarts'
import { useEffect, useState } from 'react'

const GenericChart = (props) => {
    const id = "id_" + new Date().getTime() + (Math.random() * 100).toFixed(0)
    const style = props.style || {backgroundColor:'transparent', flex: '1', width:'100%', height: '100%'};
    
    const [chart, setChart] = useState(undefined)

    //Listener para fazer o resize
    useEffect(()=>{
        const updateDimensions = () => {
            chart?.resize();
        }
        window.addEventListener("resize", updateDimensions);
        return ()=>{
            window.removeEventListener("resize", updateDimensions);
        }
    }, [chart])

    //Inicialização do gráfico
    useEffect(()=>{
        const renderChart = () => {
            const element = document.getElementById(id)
            if(element){
                const myChart = echarts.init(element)
                myChart.setOption(props.option)
                setChart(myChart)
                if(myChart) myChart.resize()
            }
        }
        renderChart()
    // eslint-disable-next-line
    }, [])

    //Atualização do gráfico
    useEffect(()=>{
        const updateChart = () => {
            if(chart){
                const notMerge = typeof props.notMerge === 'undefined' ? true : props.notMerge
                chart.setOption(props.option, {notMerge: notMerge })
            }
        }
        updateChart()
    },[chart, props.notMerge, props.option])

    return(<div id={id} style={style}></div>)
}

export default GenericChart