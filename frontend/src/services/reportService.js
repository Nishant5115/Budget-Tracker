import API from "./api";

export const downloadMonthlyReport = async (month, year) => {
  const response = await API.get(
    `/reports/monthly?month=${month}&year=${year}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `budget-report-${month}-${year}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};










