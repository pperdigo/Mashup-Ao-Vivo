import * as echarts from "echarts";
import { useEffect, useState } from "react";

const GenericChart = (props) => {
  const id = "id_" + new Date().getTime() + (Math.random() * 100).toFixed(0);
  const style = props.style || { backgroundColor: "transparent", flex: "1", width: "100%", height: "100%" };

  const [chart, setChart] = useState(undefined);

  //Inicialização do gráfico
  useEffect(() => {
    const renderChart = () => {
      const element = document.getElementById(id);
      if (element) {
        const myChart = echarts.init(element);
        myChart.setOption(props.option);
        setChart(myChart);
        if (myChart) myChart.resize();
      }
    };
    renderChart();

    return () => {
      echarts.dispose(chart);
    };
    // eslint-disable-next-line
    }, [])

  //Atualização do gráfico
  useEffect(() => {
    const updateChart = () => {
      if (chart) {
        const notMerge = typeof props.notMerge === "undefined" ? true : props.notMerge;
        chart.setOption(props.option, { notMerge: notMerge });
      }
    };
    updateChart();
  }, [chart, props.notMerge, props.option]);

  //Listener para fazer o resize
  useEffect(() => {
    const updateDimensions = () => {
      chart?.resize();
    };
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [chart]);

  //Bindar onclick
  useEffect(() => {
    const bindFilter = (params) => {
      props?.onClickFilterFunction(params);
    };

    // chart?.on("click", bindFilter);
    if (chart && props.onClickFilterFunction) {
      chart.on("click", bindFilter);
    }

    return () => {
      chart?.off("click");
    };
  });
  return <div id={id} style={style}></div>;
};

export default GenericChart;
