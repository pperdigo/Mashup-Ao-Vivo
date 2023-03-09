import { useState } from 'react';
import '../../Styles/FilterBar.css'

import filterIcon from '../../img/material-symbols_filter-alt.svg'
import filterClosedIcon from '../../img/closeFilterbar.svg'

 

function FilterBar() {
    const [open, setOpen] = useState(false);

return (
    <>

        <div className="sidebar-btn" onClick={() => {setOpen(!open)}}><img src={filterIcon} alt=""></img></div>

        <div className={open ? 'right-sidebar active' : 'right-sidebar'}>
            <div className="top-sidebar">
              <span>Current selections</span>
              <div className="sidebar-btn" onClick={() => {setOpen(!open)}}><img src={filterClosedIcon} alt=""></img>
              </div>
            </div>
        </div>

        <div 
        onClick={() => {setOpen(!open)}} 
        className={open ? 'close-right-sidebar active' : 'close-right-sidebar'}>
        </div>

    </>
);
    
}

export default FilterBar
