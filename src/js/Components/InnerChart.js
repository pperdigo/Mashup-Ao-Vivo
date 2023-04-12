// eslint-disable-next-line
import * as echarts from "echarts";
import "../../Styles/echarts.css";

const innerChart = (app, tooltipClassName, selectedMonth) => {
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
            qFieldDefs: ["Product Group Desc"],
          },
        },
      ],
      qMeasures: [
        {
          qDef: {
            qDef: `Sum({<Month = {${selectedMonth}}>}[Sales Margin Amount])`,
          },
          qSortBy: {
            qSortByNumeric: -1,
          },
        },
      ],
      qSuppressZero: false,
      qSuppressMissing: false,
      qInterColumnSortOrder: [1, 0],
    });
  };

  const transformData = (reply) => {
    const matrix = reply.layout.qHyperCube.qDataPages[0].qMatrix;

    const data = matrix.map((row) => {
      return { name: row[0].qText, value: row[1].qNum };
    });

    const totalValue = data.reduce((acum, curr) => acum + curr.value, 0);
    const treshold = (30 / 360) * totalValue;

    const others = { name: "Others", value: 0 };
    let dataFiltered = [];

    data.forEach((row) => {
      if (row.value < treshold) {
        others.value += row.value;
      } else {
        dataFiltered.push(row);
      }
    });

    dataFiltered.push(others);

    return dataFiltered;
  };

  const getOption = (data) => {
    const option = {
      title: {
        text: "Gráfico Interno",
        textStyle: {
          color: "white",
          fontWeight: "bold",
        },
      },
      color: ["#3b49ee", "#89f2f2", "#4191e1", "#2d669d", "#a4d2ff"],
      series: [
        {
          name: "Access From",
          type: "pie",
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "white",
            borderWidth: 8,
          },
          label: {
            show: true,
            position: "outside",
            color: "black",
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
      media: [
        {
          query: { minWidth: 0 },
          option: {
            series: [
              {
                radius: ["15%", "35%"],
                labelLine: {
                  length: 2,
                  length2: 0,
                },
              },
            ],
          },
        },
        {
          query: { minWidth: 290 },
          option: {
            series: [
              {
                radius: ["20%", "40%"],
                labelLine: {
                  length: 6,
                  length2: 0,
                },
              },
            ],
          },
        },
        {
          query: { minWidth: 400 },
          option: {
            series: [
              {
                radius: ["40%", "70%"],
                labelLine: {
                  length: 20,
                  length2: 0,
                },
              },
            ],
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
        const element = document.querySelector(`.${tooltipClassName}`);
        let myChart = echarts.getInstanceByDom(element);
        if (myChart) {
          echarts.dispose(myChart);
        }
        myChart = echarts.init(element);
        myChart.setOption(option);
        myChart.resize();
      }
    });
};
export default innerChart;
