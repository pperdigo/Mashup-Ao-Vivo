import { useState, useContext } from 'react';
import '../../Styles/FilterBar.css'
import QlikObject from '../qlik/QlikObject';

import filterIcon from '../../img/material-symbols_filter-alt.svg'
import filterClosedIcon from '../../img/closeFilterbar.svg'



function FilterBar() {
    const [open, setOpen] = useState(false);
    const ids = [
                    {qlikId: 'bJPHMdB', objId:'yearmonth'}, 
                    {qlikId: 'XttCt', objId:'year'}, 
                    {qlikId: 'fMTNJ', objId:'sales-rep'}, 
                    {qlikId: 'esYPmUy', objId:'state-name'}, 
                    {qlikId: 'VtwmPj', objId:'product-sub-group'}
                ]


    return (
        <>
            <div className="sidebar-btn" onClick={() => {setOpen(!open)}}>
                <img src={filterIcon} alt=""></img>
            </div>

            <div className={open ? 'right-sidebar active' : 'right-sidebar'}>
                <div className="top-sidebar">
                    <span>Current selections</span>
                    <div className="sidebar-btn" onClick={() => {setOpen(!open)}}>
                        <img src={filterClosedIcon} alt="" />
                    </div>
                </div>
                <div className='sidebar-content'>
                    {
                        ids.map(id => {
                            return <QlikObject key = {id.qlikId} qlikId = {id.qlikId} objId = {id.objId} />
                        })
                    }
                </div>
            </div>

            <div 
                onClick={() => {setOpen(!open)}} 
                className={open ? 'close-right-sidebar active' : 'close-right-sidebar'}
            / >
        </>
    );
    
}

export default FilterBar
