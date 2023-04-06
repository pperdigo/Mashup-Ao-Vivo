import { useState, useContext, useRef, useCallback, useEffect } from "react";
import { AppContext } from "../../App";
import GenericChart from "../echarts/GenericChart";

import "../../Styles/echarts.css";

function PieChart(props) {
  const [data, setData] = useState();
  const app = useContext(AppContext);
  const id = useRef("");

  const getDefs = useCallback(() => {
    const defs = {
      "By Product Subgroup": {
        dimension: "Product Group Desc",
        measure: "Sum([Sales Margin Amount])",
      },
      "By State": {
        dimension: "state_name",
        measure: "Sum ([Sales Amount])",
      },
      "By Sales Rep": {
        dimension: "Sales Rep Name",
        measure: "Sum ([Budget Amount])",
      },
    };

    return defs[props.title];
    // eslint-disable-next-line
    }, [])

  useEffect(() => {
    app.createCube(
      {
        qInitialDataFetch: [
          {
            qHeight: 4999,
            qWidth: 2,
          },
        ],
        qDimensions: [
          {
            qDef: {
              qFieldDefs: [getDefs().dimension],
            },
          },
        ],
        qMeasures: [
          {
            qDef: {
              qDef: getDefs().measure,
            },
            qSortBy: {
              qSortByNumeric: -1,
            },
          },
        ],
        qSuppressZero: false,
        qSuppressMissing: false,
        qInterColumnSortOrder: [1, 0],
      },
      (reply) => {
        const matrix = reply.qHyperCube.qDataPages[0].qMatrix;

        const data = matrix.map((row) => {
          return { name: row[0].qText, value: row[1].qNum };
        });

        const totalValue = data.reduce((acum, curr) => acum + curr.value, 0);
        const treshold = (props.minAngle / 360) * totalValue;

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
        id.current = reply.qInfo.qId;
        setData(dataFiltered);
      },
    );

    return () => {
      app.destroySessionObject(id.current);
    };
  }, [props.minAngle, props.title, app, getDefs]);

  const getOption = () => {
    const option = {
      title: {
        text: props.title,
        textStyle: {
          color: "white",
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        className: "echarts-tooltip",
        formatter: (params) => {
          return `
          <p>${params.seriesName}</p>
          <p class = 'left-align'>
            <span class = 'dot' style = 'background-color: ${params.color}'></span>
            ${params.name}
            <span class = 'right-align bold'>
                ${params.value.toLocaleString("pt-BR", { style: "currency", currency: "USD" })}
                (${(params.percent / 100).toLocaleString("pt-BR", { style: "percent" })})
            </span>
          </p>
          `;
        },
        // position: (point) => {
        //   return [point[0], "0%"];
        // },
      },
      color: ["#3b49ee", "#89f2f2", "#4191e1", "#2d669d", "#a4d2ff"],
      series: [
        {
          name: "Access From",
          type: "pie",
          //   radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "rgba(0,9,118,1)",
            borderWidth: 8,
          },
          label: {
            show: true,
            position: "outside",
            color: "white",
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

  // eslint-disable-next-line
  const onClickFilterFunction = (params) => {
    console.log("params", params);
    app.field(getDefs().dimension).selectMatch(params.name);
  };

  if (!data) return "Carregando";

  return <GenericChart option={getOption()} onClickFilterFunction={onClickFilterFunction} />;
}

export default PieChart;
