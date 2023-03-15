/* import NavBar from '../Components/NavBar' */
import '../../Styles/Home.css'
import NavBar from '../Components/NavBar'
import KPI from '../Components/KPI'

function Home(){
    return(
        <>
            <NavBar/>
            <div className = 'container-fluid mt-4'>
                <div className = 'row pb-2 pt-2 height-300'>
                    <div className='col-4 pt-5'>
                        <KPI
                            title = {'Margin %'}
                        / >
                    </div>
                    <div className='col-4 pt-2'>
                        {/* <PieChart
                            app = {props.app}
                            title = {'By Product Subgroup'}
                            minAngle = {30}
                        / > */}
                    </div>
                    <div className='col-4'>
                        {/* <LineChart
                            app = {props.app}
                            title = {'Margin Amount Over Time'}
                        / > */}
                    </div>
                </div>

                <div><hr className = 'breakline'></hr></div>
                <div className = 'row pb-2 pt-2 height-300'>
                    <div className='col-4 pt-5'>
                        <KPI
                            title = {'TY vs LY Sales'}
                        / >
                    </div>
                    <div className='col-4 pt-2'>
                        {/* <PieChart
                            app = {props.app}
                            title = {'By State'}                                                      
                            minAngle = {30}
                        / > */}
                    </div>
                    <div className='col-4'>
                        {/* <LineChart
                            app = {props.app}
                            title = {'Sales Over Time'}
                        / > */}
                    </div>
                </div>
                
                <div><hr className = 'breakline'></hr></div>
                <div className = 'row pb-2 pt-2 height-300'>
                    <div className='col-4 pt-5'>
                        <KPI
                            title = {'Sales vs Budget %'}
                        / >
                    </div>
                    <div className='col-4 pt-2'>
                        {/* <PieChart
                            app = {props.app}
                            title = {'By Sales Rep'}
                            minAngle = {15}
                        / > */}
                    </div>
                    <div className='col-4'>
                        {/* <LineChart
                            app = {props.app}
                            title = {'Budget Over Time'}
                        / > */}
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default Home