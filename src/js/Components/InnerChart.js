// eslint-disable-next-line
import * as echarts from "echarts";
import "../../Styles/echarts.css";

const innerChart = (app) => {
  console.log("innerchart chamado");
  // eslint-disable-next-line
  const id = "innerChart";

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
    console.log("reply", reply);
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
    console.log("data", data);
    const option = {
      title: {
        text: "Gráfico teste",
        textStyle: {
          color: "white",
        },
      },
      tooltip: {
        show: false,
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
    return option;
  };

  getData()
    .then((reply) => transformData(reply))
    .then((data) => getOption(data))
    .then((option) => {
      if (option) {
        console.log("option", option);
        const element = document.querySelector(`.${id}`);
        console.log("element", element);
        const myChart = echarts.init(element);
        myChart.setOption(option);
      }
    });
};
export default innerChart;
