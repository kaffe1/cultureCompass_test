import { useState, useEffect } from "react";
import * as d3 from "d3";

export const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await d3.csv("/Culture-Compass-Cleaned.csv");
        setData(csvData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading CSV:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
