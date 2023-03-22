import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { AppContext } from '../../App'

import dollarIcon from '../../img/material-symbols_attach-money.svg'
import lineIcon from '../../img/tabler_chart-infographic.svg'
import targetIcon from '../../img/octicon_goal-24.svg'

import '../../Styles/KPI.css'

function KPI(props){
    const app = useContext(AppContext)
    const id = useRef('')
    const [data, setData] = useState()

    const getDefs = useCallback(() => {
        const defs = {
            'Margin %':{
                measure: 'Sum([Sales Margin Amount])/Sum([Sales Amount])',
                icon: dollarIcon
            },
            'TY vs LY Sales':{
                measure: '(sum([YTD Sales Amount])-sum([LY YTD Sales Amount])*0.2)/sum([LY YTD Sales Amount])',
                icon: lineIcon
            },
            'Sales vs Budget %':{
                measure: 'Sum ([Budget Amount])/Sum ([Actual Amount])',
                icon: targetIcon
            }
        }

        return defs[props.title]
    // eslint-disable-next-line
    }, [])

    useEffect(()=>{
        app.createCube({
            qInitialDataFetch: [
                {
                    qHeight: 1,
                    qWidth: 1
                }
            ],
            qDimensions: [],
            qMeasures: [
                {
                    qDef:{
                        qDef: getDefs().measure
                    }
                }
            ],
            qSuppressZero: false,
            qSuppressMissing: false,
            qInterColumnSortOrder: [],
        }, (reply) => {
            const result = reply.qHyperCube.qDataPages[0].qMatrix[0][0].qNum
            id.current = reply.qInfo.qId

            setData(result)
        })

        return () => {
            app.destroySessionObject(id.current)
        }
    // eslint-disable-next-line
    }, [getDefs])

    if (!data) return 'Carregando.'

    return(
        <div className='fundo-kpi'>
            <div className='kpi-title-row'>
                {props.title}
            </div>
            <div className='kpi-content-row'>
                <img className='kpi-icon' src={getDefs().icon}/>
                <div className='kpi-content'>
                    {data.toLocaleString('pt-BR', {style: 'percent'})}
                </div>
            </div>
        </div>
    )
}

export default KPI