import menuIcon from '../../img/material-symbols_menu.svg'
import logoIcon from '../../img/logo.svg'

import '../../Styles/NavBar.css'
import FilterBar from './FilterBar'

function NavBar() {
  return(
    <div className='nav-bar'>
        <div className='left-nav-bar'>
            <img  className='menu-icon' src= {menuIcon} alt=''/>
            <span className='page-title'>KPI DASHBOARD</span>
        </div>
        <img className='logo-nav-bar' src= {logoIcon}  alt='' />
        
        
        <FilterBar/>
    </div>
)
}

export default NavBar