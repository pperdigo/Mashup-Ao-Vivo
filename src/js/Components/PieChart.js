import { useState, useContext, useRef, useCallback, useEffect } from "react";
import { AppContext } from "../../App";
import GenericChart from "../echarts/GenericChart";

import "../../Styles/echarts.css";

function PieChart(props) {
  // eslint-disable-next-line
  let selections = [];
  const [data, setData] = useState();
  const app = useContext(AppContext);
  const id = useRef("");

  const getDefs = useCallback(() => {
    const defs = {
      "By Product Subgroup": {
        dimension: "Product Group Desc",
        resetFilterDimension: "Product Sub Group Desc",
        measure: "Sum([Sales Margin Amount])",
      },
      "By State": {
        dimension: "state_name",
        resetFilterDimension: "state_name",
        measure: "Sum ([Sales Amount])",
      },
      "By Sales Rep": {
        dimension: "Sales Rep Name",
        resetFilterDimension: "Sales Rep Name",
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
      },
      toolbox: {
        feature: {
          myQlikResetFilter: {
            show: true,
            title: "Resetar Filtros",
            iconStyle: {
              borderColor: "white",
              borderWidth: 2,
            },
            icon: ` path://M18 13C17.4904 11.9961 16.6247 11.1655 15.5334 10.6333C14.442
                    10.1011 13.1842 9.89624 11.9494 10.0495C9.93127 10.3 8.52468 11.6116
                    7 12.8186M7 10V13H10`,
            onclick: () => {
              app.field(getDefs().resetFilterDimension).clear();
            },
          },
          myQlikApplyFilter: {
            show: true,
            title: "Aplicar Filtros",
            iconStyle: {
              borderColor: "white",
              borderWidth: 2,
            },
            icon: ` path://M512 256l144.8 144.8-36.2 36.2-83-83v311.6h-51.2V354l-83
                    83-36.2-36.2L512 256zM307.2 716.8V768h409.6v-51.2H307.2z`,
            onclick: () => {
              const arrOfSelections = selections.map((selection) => {
                return { qText: selection };
              });
              console.log(arrOfSelections);
              app.field(getDefs().dimension).selectValues(arrOfSelections);
            },
          },
        },
      },
      color: ["#3b49ee", "#89f2f2", "#4191e1", "#2d669d", "#a4d2ff"],
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
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
    };

    return option;
  };

  if (!data) return "Carregando";

  return <GenericChart option={getOption()} selections={selections} />;
}

export default PieChart;
