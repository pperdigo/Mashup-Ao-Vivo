import { useContext } from "react";
import { AppContext } from "../../App";

const HypercubePagination = () => {
  const app = useContext(AppContext);

  app
    .createCube({
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["AggKey"],
          },
        },
      ],
    })
    .then((model) => {
      console.log(model);
      const modelSize = model.layout.qHyperCube.qSize;
      const modelWidth = modelSize.qcx;
      const modelHeight = modelSize.qcy;

      const pageHeight = Math.floor(10000 / modelWidth);
      const totalPages = Math.ceil(modelHeight / pageHeight);

      const arrOfPromises = [];
      for (let i = 0; i < totalPages; ++i) {
        const page = {
          qTop: i * pageHeight,
          qHeight: pageHeight,
          qWidth: modelWidth,
          index: i,
        };
        arrOfPromises.push(model.getHyperCubeData("/qHyperCubeDef", [page]));
      }

      Promise.all(arrOfPromises).then((data) => console.log(data));
    });
  return "Nada";
};

export default HypercubePagination;
