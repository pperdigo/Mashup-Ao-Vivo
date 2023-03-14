import { useEffect, useContext, useState } from "react"
import { AppContext } from '../../App'

function QlikObject(props){
    const style = {height: '50px'}
    const app = useContext(AppContext)

    useEffect(()=>{
        app.getObject(props.objId, props.qlikId)
    }, [])

    return <div id={props.objId} style = {style}></div>
}

export default QlikObject