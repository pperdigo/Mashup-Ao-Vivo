import { useEffect, useContext, useRef } from "react"
import { AppContext } from '../../App'

function QlikObject(props) {
    const id = useRef("")
    const app = useContext(AppContext)

    useEffect(() =>{
        app.getObject(props.objectId, props.qlikId)
            .then((reply)=>{
                id.current = reply.layout.qInfo.qId
        })

        return () => {
            app.destroySessionObject(id.current)
        } 

    },[app, props.objectId, props.qlikId])
  

  const height = props.height || 50;
  const style = props.style || {height : height};

  return (
      <div className="native-chart" style={style} id={props.objectId}>
          
      </div>
  );
}

export default QlikObject
