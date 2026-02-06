import { useEffect, useState } from "react";
import { getCategorySummary } from "./services/transactionServices";
import CategoryPieChart from "./charts/CategoryPieChart";

function App() {
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategorySummary();
      setCategoryData(data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Budget Tracker Dashboard</h1>

      {Object.keys(categoryData).length > 0 ? (
        <CategoryPieChart data={categoryData} />
      ) : (
        <p>No expense data</p>
      )}
    </div>
  );
}

export default App;
