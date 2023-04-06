/* import NavBar from '../Components/NavBar' */
import "../../Styles/Home.css";
import NavBar from "../Components/NavBar";
import KPI from "../Components/KPI";
import PieChart from "../Components/PieChart";
import LineChart from "../Components/LineChart";
//eslint-disable-next-line
import { useEffect, useContext, useRef } from "react";
import { AppContext } from "../../App";

function Home() {
  //eslint-disable-next-line
  const app = useContext(AppContext);
  //eslint-disable-next-line
  const id = useRef("");
  //   useEffect(() => {
  //     const getMaxYear = async () => {
  //       const reply = await app.createGenericObject({
  //         maxYear: { qValueExpression: "MAX(Year)" },
  //       });
  //       console.log(reply);
  //       id.current = reply.id;
  //       return reply.layout.maxYear;
  //     };
  //     getMaxYear().then((maxYear) => {
  //       app.field("Year").selectMatch(maxYear);
  //     });

  //     return () => {
  //       app.destroySessionObject(id.current);
  //     };
  //     //eslint-disable-next-line
  //   }, []);

  useEffect(() => {
    app.bookmark.apply("VUqRT");
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <NavBar />
      <div className="container-fluid mt-4">
        <div className="row pb-2 pt-2 height-300">
          <div className="col-4 pt-5">
            <KPI title={"Margin %"} />
          </div>
          <div className="col-4 pt-2">
            <PieChart title={"By Product Subgroup"} minAngle={25} />
          </div>
          <div className="col-4">
            <LineChart title={"Margin Amount Over Time"} />
          </div>
        </div>

        <div>
          <hr className="breakline"></hr>
        </div>
        <div className="row pb-2 pt-2 height-300">
          <div className="col-4 pt-5">
            <KPI title={"TY vs LY Sales"} />
          </div>
          <div className="col-4 pt-2">
            <PieChart title={"By State"} minAngle={25} />
          </div>
          <div className="col-4">
            <LineChart title={"Sales Over Time"} />
          </div>
        </div>

        <div>
          <hr className="breakline"></hr>
        </div>
        <div className="row pb-2 pt-2 height-300">
          <div className="col-4 pt-5">
            <KPI title={"Sales vs Budget %"} />
          </div>
          <div className="col-4 pt-2">
            <PieChart title={"By Sales Rep"} minAngle={15} />
          </div>
          <div className="col-4">
            <LineChart title={"Budget Over Time"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
