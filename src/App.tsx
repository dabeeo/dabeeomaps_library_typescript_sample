import { useCallback, useState } from "react";
import "./App.css";
import Loading from "./components/Loading/Loading";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import Main from "./components/Main/Main";

const dabeeoMaps = new (window as any).dabeeo.Maps(true); // 1번만 호출

// 동일 데이터에 대해 1번만 호출
const mapData = await dabeeoMaps.getMapData({
  clientId: "byQdkBiK4_qbW3lNRooB_Q",
  clientSecret: "2e77b65e659705891c0ca2e66d74e285",
});

function App() {
  const [map, setMap] = useState<any | null>(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const removeMap = () => {
    if (map) {
      map.context.cleanup();
      const mapContainer = document.querySelector(".map");
      if (mapContainer?.parentNode) {
        mapContainer.parentNode.removeChild(mapContainer);
      }
      setMap(null);
    }
  };

  const addMap = useCallback(async (parent: HTMLElement) => {
    const mapContainer = document.createElement("div");
    mapContainer.style.width = "80%";
    mapContainer.style.height = "100%";
    mapContainer.classList.add("map");
    parent.appendChild(mapContainer);

    setLoading(true);

    const mapOption = {};
    const dabeeoMap = await dabeeoMaps.showMap(
      mapContainer,
      mapOption,
      mapData
    );
    console.log("showMap");
    setMap(dabeeoMap);
    setLoading(false);

    return mapData;
  }, []);

  return (
    <div className="App">
      {loading && <Loading />}
      <Header setCount={setCount} />
      {count === 2 ? (
        <Map
          map={map}
          addMap={addMap}
          removeMap={removeMap}
          setLoading={setLoading}
        />
      ) : (
        <Main count={count} />
      )}
    </div>
  );
}

export default App;
