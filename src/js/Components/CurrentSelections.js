import { useEffect, useState, useRef, useContext } from 'react';
import closeIcon from '../../img/close.svg'
import { AppContext } from '../../App'

function CurrentSelections(props){
  const [selections, setSelections] = useState([])
  const id = useRef("")
  const app = useContext(AppContext)

 useEffect(()=>{

   function getSelections(){
       app.getList("CurrentSelections", (reply)=>{
 
           const selections = reply.qSelectionObject.qSelections;
 
           let currentSelections = [];
 
           selections.forEach(element => {
               currentSelections.push({
                   field: element.qField,
                   values: element.qSelected
               })
           });
           
           id.current = reply.qInfo.qId
           setSelections(currentSelections)
           return () => {
               app.destroySessionObject(id.current)
           } 
           
       })
 
   }

   getSelections();

   
 },[app])

 

 function clearField(field){
     app.field(field).clear();
 }

 
     let content = <div> No filters applied</div>;

     if(selections.length > 0){
         content = selections.map(item => {
             return <div key={item.field + '/' + item.field} className="selected-block">
                         <div className="current-information">
                             <div className="current-title-div">{item.field}</div>
                             <div className="filters-items">
                                 <div>
                                     {item.field}
                                 </div>
                                 <button onClick={()=>{clearField(item.field)}} className="x-clear-btn"><img src={closeIcon} alt="" width="10px"/></button>
                             </div>
                         </div>
                     </div>
         })
     }

     return (
     <div className="current-selections custom-font">
         {content}
     </div>); 
 }

export default CurrentSelections
