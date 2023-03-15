import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import App, { AppContext } from '../../App'
import dollarIcon from '../../img/material-symbols_attach-money.svg'
import lineIcon from '../../img/tabler_chart-infographic.svg'
import targetIcon from '../../img/octicon_goal-24.svg'


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

    })

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
            console.log(props.title, reply)
        })
    })

    return(
        <div style = {{color: 'white'}}>
            {props.title}
        </div>
    )
}

export default KPI