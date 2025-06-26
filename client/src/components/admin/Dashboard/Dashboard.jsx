import { useState } from "react";
import { Download } from "lucide-react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
const API_BASE_URL = import.meta.env.API_BASE_URL;

const Dashboard = () => {
  const [exportType, setExportType] = useState("");
  const [dataType, setDataType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    if (!exportType || !dataType) {
      setError("Vui lòng chọn cả định dạng File và dữ liệu muốn kết xuất");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/export/${dataType}`,
        {
          params: { format: exportType },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: exportType === "csv" ? "text/csv" : "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${dataType}_export.${exportType}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while exporting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Kết xuất File theo định dạng CSV / JSON" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
              Kết xuất dữ liệu
            </h1>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Chọn định dạng File</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Chọn bảng dữ liệu</option>
                  <option value="customers">Customers</option>
                  <option value="products">Products</option>
                </select>
                <button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Đang xuất..." : "Xuất"}
                  <Download className="ml-2 -mr-1 h-5 w-5" />
                </button>
              </div>
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
