import React, { useMemo } from "react";
import Density_plot from "./subViews/DensityPlotView";

const DIMENSIONS = [
  { id: "impFamily", label: "Family" },
  { id: "impFriends", label: "Friends" },
  { id: "impLeisure", label: "Leisure" },
  { id: "impPolitics", label: "Politics" },
  { id: "impWork", label: "Work" },
  { id: "impReligion", label: "Religion" },
];

const DistributionView = ({
  data,
  activeWaves,
  onWaveChange,
  activeDimension,
  onDimensionChange,
}) => {
  // Compute distributions for ALL dimensions so small charts can be rendered
  const dimensionData = useMemo(() => {
    if (!data || !activeWaves || activeWaves.length !== 2 || !activeDimension)
      return null;

    const [waveA, waveB] = activeWaves;

    const getDistribution = (waveStr, dimension) => {
      const recordsForWave = data.filter(
        (d) => String(d.wave) === String(waveStr),
      );
      const total = recordsForWave.length;
      if (total === 0) return { dist: { 1: 0, 2: 0, 3: 0, 4: 0 }, mean: 0 };

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
      let sum = 0;
      let validCount = 0;

      recordsForWave.forEach((row) => {
        const rawVal = parseInt(row[dimension], 10);
        if (rawVal >= 1 && rawVal <= 4) {
          // FLIP VALUE: 1 -> 4, 2 -> 3, 3 -> 2, 4 -> 1
          // Now 1 = Not at all important, 4 = Very important
          const val = 5 - rawVal;
          counts[val] += 1;
          sum += val;
          validCount += 1;
        }
      });

      return {
        dist: {
          1: validCount ? (counts[1] / validCount) * 100 : 0,
          2: validCount ? (counts[2] / validCount) * 100 : 0,
          3: validCount ? (counts[3] / validCount) * 100 : 0,
          4: validCount ? (counts[4] / validCount) * 100 : 0,
        },
        mean: validCount ? sum / validCount : 0,
      };
    };

    const result = {};
    DIMENSIONS.forEach((dimObj) => {
      result[dimObj.id] = {
        waveA: getDistribution(waveA, dimObj.id),
        waveB: getDistribution(waveB, dimObj.id),
      };
    });

    return result;
  }, [data, activeWaves, activeDimension]);

  if (!dimensionData) {
    return <div>Waiting for data...</div>;
  }

  const handleWaveClick = (w) => {
    if (activeWaves.includes(w)) return;
    onWaveChange([activeWaves[1], w]);
  };

  const otherDimensions = DIMENSIONS.filter((d) => d.id !== activeDimension);

  return (
    <div className="single-country-view" style={{ padding: "0" }}>
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2rem",
          marginLeft: "2rem",
          marginRight: "2.2rem",
        }}
      >
        {/* Left Side: Title and Active Dimension Selector */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#333",
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            paddingRight: "0.5rem",
            margin: 0,
          }}
        >
          China
        </h1>
        {/* Right Side: Wave Buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[2, 3, 4, 5, 6, 7].map((w) => {
            const isWaveA = activeWaves[0] === w;
            const isWaveB = activeWaves[1] === w;
            const isActive = isWaveA || isWaveB;

            let bgColor = "#fff";
            let textColor = "#333";
            let borderColor = "#ccc";

            if (isWaveA) {
              bgColor = "#1f77b4"; // Blue for WaveA
              textColor = "#fff";
              borderColor = "#1f77b4";
            } else if (isWaveB) {
              bgColor = "#2ca02c"; // Green for WaveB
              textColor = "#fff";
              borderColor = "#2ca02c";
            }

            return (
              <button
                key={w}
                onClick={() => handleWaveClick(w)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  color: textColor,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? "bold" : "normal",
                  transition: "all 0.2s",
                }}
              >
                Wave {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT SECTION */}

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Left Column: Big Plot */}
        <div
          style={{
            flex: 1,
            minWidth: "500px",
            position: "relative",
            paddingTop: "2rem",
          }}
        >
          {/* value selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              position: "absolute",
              top: "0",
              left: "120px",
            }}
          >
            <select
              value={activeDimension}
              onChange={(e) => onDimensionChange(e.target.value)}
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#333",
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                paddingRight: "0.5rem",
                margin: 0,
              }}
            >
              {DIMENSIONS.map((dim) => (
                <option key={dim.id} value={dim.id}>
                  {dim.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown icon to hint it's a select */}
            <div
              style={{
                pointerEvents: "none",
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
          </div>
          {/* Badge for active dimension change */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              position: "absolute",
              top: "8px",
              right: "120px",
            }}
          >
            {(() => {
              const dataRef = dimensionData[activeDimension];
              const pctChange = dataRef.waveA.mean
                ? (
                    ((dataRef.waveB.mean - dataRef.waveA.mean) /
                      dataRef.waveA.mean) *
                    100
                  ).toFixed(2)
                : "0.00";
              return (
                <span
                  style={{
                    backgroundColor: "#e2e8f0",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    color: "#4a5568",
                    fontWeight: "500",
                  }}
                >
                  Change: {pctChange > 0 ? "+" : ""}
                  {pctChange}%
                </span>
              );
            })()}
          </div>
          <Density_plot
            Wave1={dimensionData[activeDimension].waveA}
            Wave2={dimensionData[activeDimension].waveB}
            small={false}
          />
        </div>

        {/* Right Column: 5 Small Plots */}
        <div
          style={{
            width: "260px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "1rem",
            marginRight: "3rem",
          }}
        >
          {otherDimensions.map((dimObj) => {
            const dimData = dimensionData[dimObj.id];
            // Calculate percentage change between means
            const pctChange = dimData.waveA.mean
              ? (
                  ((dimData.waveB.mean - dimData.waveA.mean) /
                    dimData.waveA.mean) *
                  100
                ).toFixed(2)
              : "0.00";

            return (
              <div key={dimObj.id} style={{ paddingBottom: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    {dimObj.label}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#e2e8f0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    Change: {pctChange > 0 ? "+" : ""}
                    {pctChange}%
                  </span>
                </div>
                <Density_plot
                  Wave1={dimData.waveA}
                  Wave2={dimData.waveB}
                  small={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DistributionView;
