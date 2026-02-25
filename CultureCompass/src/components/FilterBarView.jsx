import * as d3 from "d3";
import BarChart from "./subViews/barChart";
import { useEffect, useRef, useState } from "react";
import "../css/FilterBarView.css";

export default function FilterBarView({ data, activeWaves }) {
  // console.log("Aktiva waves", activeWaves);
  const [waveA, waveB] = activeWaves;
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    // Fetch and filter data for only the two waves, whenever the two waves chosen is changed
    recordsForWave(data);
  }, [activeWaves]);

  function filterWave(d) {
    // Function which filters for only two waves
    return String(d.wave) == String(waveA) || String(d.wave) == String(waveB);
  }

  function sumFunc(d, wave, sex) {
    // Function which filters for a specific wave and gender, in order to sum it.
    return data.filter((d) => d.wave == wave && d.sex == sex).length;
  }
  function countSex(data) {
    //Function which sums gender for two different waves (Male WA, Female WA, Male WB, Female WB)
    const MaleWA = sumFunc(data, waveA, 1);
    const FemaleWA = sumFunc(data, waveA, 2);
    const MaleWB = sumFunc(data, waveB, 1);
    const FemaleWB = sumFunc(data, waveB, 2);
    return [
      { Wave: waveA, Sex: "Male", Amount: MaleWA },
      { Wave: waveA, Sex: "Female", Amount: FemaleWA },
      { Wave: waveB, Sex: "Male", Amount: MaleWB },
      { Wave: waveB, Sex: "Female", Amount: FemaleWB },
    ];
  }

  function recordsForWave(data) {
    //Filters the data for two waves
    const localVariable = data.filter(filterWave);
    setLocalData(localVariable);

    const filteredObject = countSex(localData, waveA, waveB);
  }

  // console.log("Local Data TEST", localData);

  const summed_Data = countSex(localData);
  // console.log(summed_Data);

  return (
    <div className="barParent">
      <div>Filter Bars</div>
      {/* <div className="legendParent">
        <button id="Male">Male</button>
        <button id = "Female">Female</button>
      </div> */}
      <BarChart data={summed_Data} />
    </div>
  );
}
