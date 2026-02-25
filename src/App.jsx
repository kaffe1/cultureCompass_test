import { useState, useMemo } from "react";
import "./App.css";
import { useData } from "./utils/dataLoader";
import { applyFilters } from "./utils/filters";
import MapView from "./components/MapView";
import DistributionView from "./components/DistributionView";
import FilterBarView from "./components/FilterBarView";

function App() {
  const { data, loading } = useData();
  // console.log(data);

  // Maintain filter states
  const [filters, setFilters] = useState({
    ageRange: [0, 100], // Example: [18, 30]
    sex: 0, // Example: 1 male or 2 female or 0 all
    country: "CHN", // Example: 'ARG'
  });

  // filter data for different views
  const filteredData = useMemo(() => {
    return applyFilters(data, filters);
  }, [data, filters]);

  //select two waves to compare
  const [activeWaves, setActiveWaves] = useState([5, 6]);

  //select dimension to compare
  const [activeDimension, setActiveDimension] = useState("impFriends");

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "88vw",
          height: "88vh",
          margin: "auto",
        }}
      >
        <div
          style={{
            flex: 4,
            display: "flex",
            gap: "2rem",
          }}
        >
          <div style={{ flex: 2, border: "1px solid #ccc", padding: "1rem" }}>
            <DistributionView
              data={filteredData}
              activeWaves={activeWaves}
              onWaveChange={setActiveWaves}
              activeDimension={activeDimension}
              onDimensionChange={setActiveDimension}
            />
          </div>
        </div>

        {/* <div style={{ flex: 1, border: "1px solid #ccc", padding: "1rem" }}>
          <FilterBarView
            data={filteredData}
            activeWaves={activeWaves}
            activeDimension={activeDimension}
          />
        </div> */}
      </div>
    </>
  );
}

export default App;
