import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import * as echarts from "echarts";

const PieChartWithMultipleSelections = () => {
  const id = "id_unico1";
  const [option, setOption] = useState({});
  const [selections, setSelections] = useState([]);
  const app = useContext(AppContext);
  console.log("on render selections", selections);

  useEffect(() => {
    const element = document.getElementById(id);
    const myChart = echarts.init(element);
    myChart.showLoading();

    return () => echarts.dispose(document.getElementById(id));
  }, []);

  useEffect(() => {
    const getData = async () => {
      return await app.createCube(
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
                qFieldDefs: ["Product Group Desc"],
              },
            },
          ],
          qMeasures: [
            {
              qDef: {
                qDef: "Sum([Sales Margin Amount])",
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
          const data = transformData(reply);
          getOption(data);
        },
      );
    };

    const transformData = (reply) => {
      const matrix = reply.qHyperCube.qDataPages[0].qMatrix;

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

      if (others.value > 0) dataFiltered.push(others);

      return dataFiltered;
    };

    const getOption = (data) => {
      const option = {
        title: {
          text: "PieChart with Multiple Selections",
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
            myApplyFilter: {
              title: "Aplicar Filtros Selecionados",
              show: false,
              icon: `path://M18 7H17M17 7H16M17 7V6M17 7V8M12.5 5H6C5.5286 5 5.29289
                     5 5.14645 5.14645C5 5.29289 5 5.5286 5 6V7.96482C5 8.2268 5 8.35779
                     5.05916 8.46834C5.11833 8.57888 5.22732 8.65154 5.4453 8.79687L8.4688
                     10.8125C9.34073 11.3938 9.7767 11.6845 10.0133 12.1267C10.25 12.5688
                     10.25 13.0928 10.25 14.1407V19L13.75 17.25V14.1407C13.75 13.0928 13.75
                     12.5688 13.9867 12.1267C14.1205 11.8765 14.3182 11.6748 14.6226
                     11.4415M20 7C20 8.65685 18.6569 10 17 10C15.3431 10 14 8.65685 14 7C14
                     5.34315 15.3431 4 17 4C18.6569 4 20 5.34315 20 7Z`,
              iconStyle: {
                color: "white",
              },
              onclick: () => handleApplyFilters(),
            },
            myResetFilter: {
              title: "Resetar Filtros Aplicados",
              show: true,
              icon: ` path://M13 4H18.4C18.9601 4 19.2409 4 19.4548 4.10899C19.6429 4.20487 19.7948
                      4.35774 19.8906 4.5459C19.9996 4.75981 20 5.04005 20 5.6001V6.3448C20 6.58444
                      20 6.70551 19.9727 6.81942C19.9482 6.92146 19.9072 7.01893 19.8524 7.1084C19.7906
                      7.20931 19.7043 7.2958 19.5314 7.46875L18 9.00012M7.49961 4H5.59961C5.03956 4 4.75981
                      4 4.5459 4.10899C4.35774 4.20487 4.20487 4.35774 4.10899 4.5459C4 4.75981 4 5.04005
                      4 5.6001V6.33736C4 6.58195 4 6.70433 4.02763 6.81942C4.05213 6.92146 4.09263 7.01893
                      4.14746 7.1084C4.20928 7.20928 4.29591 7.29591 4.46875 7.46875L9.53149 12.5315C9.70443
                      12.7044 9.79044 12.7904 9.85228 12.8914C9.90711 12.9808 9.94816 13.0786 9.97266
                      13.1807C10 13.2946 10 13.4155 10 13.6552V18.411C10 19.2682 10 19.6971 10.1805 19.9552C10.3382
                      20.1806 10.5814 20.331 10.8535 20.3712C11.1651 20.4172 11.5487 20.2257 12.3154 19.8424L13.1154
                      19.4424C13.4365 19.2819 13.5966 19.2013 13.7139 19.0815C13.8176 18.9756 13.897 18.8485 13.9453
                      18.7083C14 18.5499 14 18.37 14 18.011V13.6626C14 13.418 14 13.2958 14.0276 13.1807C14.0521
                      13.0786 14.0926 12.9809 14.1475 12.8915C14.2091 12.7909 14.2952 12.7048 14.4669 12.5331L14.4688
                      12.5314L15.5001 11.5001M15.5001 11.5001L5 1M15.5001 11.5001L19 15`,
              iconStyle: {
                color: "white",
              },
              onclick: () => {
                console.log("clear selections", selections);

                const element = document.getElementById(id);
                const myChart = echarts.getInstanceByDom(element);

                myChart.dispatchAction({
                  type: "downplay",
                  seriesIndex: 0,
                  name: selections,
                });

                myChart.setOption({
                  toolbox: {
                    feature: {
                      myApplyFilter: {
                        show: false,
                      },
                    },
                  },
                });
                setSelections([]);
                app.field("Product Group Desc").clear();
              },
            },
          },
        },
        color: ["#3b49ee", "#89f2f2", "#4191e1", "#2d669d", "#a4d2ff"],
        series: [
          {
            name: "Access From",
            type: "pie",
            avoidLabelOverlap: false,
            // selectedMode: "multiple",
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
      setOption(option);
    };

    getData();
    //   .then((reply) => transformData(reply))
    //   .then((data) => getOption(data));
    // eslint-disable-next-line
    }, []);

  const handleApplyFilters = () => {
    console.log("apply selections", selections);
    const qlikSelections = selections.map((selection) => {
      return { qText: selection };
    });
    console.log("qlikSelections", qlikSelections);
    app.field("Product Group Desc").selectValues(qlikSelections);
  };

  const handleResetFilter = () => {
    console.log("clear selections", selections);

    const element = document.getElementById(id);
    const myChart = echarts.getInstanceByDom(element);

    myChart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      name: selections,
    });

    myChart.setOption({
      toolbox: {
        feature: {
          myApplyFilter: {
            show: false,
          },
        },
      },
    });
    setSelections([]);
    app.field("Product Group Desc").clear();
  };

  useEffect(() => {
    const element = document.getElementById(id);
    const myChart = echarts.getInstanceByDom(element);

    if (option) {
      myChart.setOption(option);
      myChart.hideLoading();
    }
  }, [option]);

  useEffect(() => {
    const customOnClickFilterFunction = (params) => {
      console.log("pre click selections", selections);
      const currSelection = params.name;
      console.log("currSelection", currSelection);

      // -------------- Encontrar instância
      const element = document.getElementById(id);
      const myChart = echarts.getInstanceByDom(element);

      // ------------- Atualizar seleções
      let tempSel = [];
      if (!selections.includes(currSelection)) {
        // setSelections((prevSel) => prevSel.concat(currSelection));
        tempSel = selections.concat(currSelection);
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          name: currSelection,
        });
      } else {
        // setSelections((prevSel) => prevSel.filter((sel) => sel !== currSelection));
        tempSel = selections.filter((sel) => sel !== currSelection);
        myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          name: currSelection,
        });
      }
      console.log("tempSel", tempSel);
      setSelections(tempSel);
      console.log("post click selections", selections);

      // Mostrar/esconder botão de aplicar filtros
      if (tempSel.length > 0) {
        myChart.setOption({
          toolbox: {
            feature: {
              myApplyFilter: {
                show: true,
              },
            },
          },
        });
      } else {
        myChart.setOption({
          toolbox: {
            feature: {
              myApplyFilter: {
                show: false,
              },
            },
          },
        });
      }
    };

    const element = document.getElementById(id);
    const myChart = echarts.getInstanceByDom(element);

    myChart.on("click", customOnClickFilterFunction);

    return () => myChart.off("click");
  }, [option, selections]);

  return (
    <>
      <button onClick={() => handleApplyFilters()}>Aplicar Filtro</button>
      <button onClick={() => handleResetFilter()}>Resetar Filtro</button>
      <div id={id} style={{ width: "800px", height: "500px", paddingTop: "150px" }}></div>
    </>
  );
};

export default PieChartWithMultipleSelections;
