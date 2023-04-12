import * as echarts from "echarts";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
// eslint-disable-next-line
import innerChart from "./InnerChart";

import "../../Styles/echarts.css";

const TooltipWithChart = () => {
  const id = "id_unico1";
  const [option, setOption] = useState();
  const app = useContext(AppContext);

  useEffect(() => {
    const element = document.getElementById(id);
    const myChart = echarts.init(element);
    myChart.showLoading();

    return () => echarts.dispose(document.getElementById(id));
  }, []);

  useEffect(() => {
    const getData = async () => {
      return await app.createCube({
        qInitialDataFetch: [
          {
            qHeight: 4999,
            qWidth: 2,
          },
        ],
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ["Month"],
              qSortCriterias: [
                {
                  qSortByNumeric: 1,
                },
              ],
            },
          },
        ],
        qMeasures: [
          {
            qDef: {
              qDef: "Sum([Sales Margin Amount])",
            },
          },
        ],
        qSuppressZero: false,
        qSuppressMissing: false,
        qInterColumnSortOrder: [0, 1],
      });
    };

    const transformData = (reply) => {
      const matrix = reply.layout.qHyperCube.qDataPages[0].qMatrix;

      const data = [];
      const axisData = [];

      matrix.forEach((row) => {
        axisData.push(row[0].qText);
        data.push(row[1].qNum);
      });

      return { axisData: axisData, data: data };
    };

    const getOption = (data) => {
      const tooltipClassName = "innerChart";
      const option = {
        title: {
          text: "Gráfico teste",
          textStyle: {
            color: "white",
          },
        },
        tooltip: {
          show: true,
          className: tooltipClassName,
          formatter: (params) => {
            innerChart(app, tooltipClassName, params.name);
            return " ";
          },
        },
        xAxis: {
          type: "category",
          data: data.axisData,
          axisLabel: {
            color: "white",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "grey",
              opacity: 0.3,
            },
          },
          axisLabel: {
            color: "white",
            formatter: (value) => {
              return (value / 1000000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " M";
            },
          },
          min: (value) => {
            return value.min - 100000;
          },
        },
        series: [
          {
            data: data.data,
            type: "line",
            itemStyle: {
              opacity: 0,
            },
          },
        ],
        media: [
          {
            query: { minWidth: 0 },
            option: {
              grid: {
                left: "20%",
              },
            },
          },
          {
            query: { minWidth: 290 },
            option: {
              grid: {
                left: "15%",
              },
            },
          },
          {
            query: { minWidth: 400 },
            option: {
              grid: {
                left: "10%",
              },
            },
          },
        ],
      };
      setOption(option);
    };

    getData()
      .then((reply) => transformData(reply))
      .then((data) => getOption(data));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const element = document.getElementById(id);
    const myChart = echarts.getInstanceByDom(element);

    if (option) {
      myChart.setOption(option);
      myChart.hideLoading();
    }
  }, [option]);

  return (
    <>
      <div id={id} style={{ width: "800px", height: "500px", paddingTop: "150px" }}></div>
    </>
  );
};

export default TooltipWithChart;
