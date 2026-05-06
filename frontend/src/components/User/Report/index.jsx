import { useEffect, useState, useCallback } from "react";
import http from "../../../utils/http";
import Loader from "../../Shared/Loader";
import { Card, Button, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const Report = () => {
  const [report, setReport] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const reportRes = await http.get("api/dashboard/report");
      setReport(reportRes.data);

      // Fetch user's transactions
      const transRes = await http.get("/api/transaction/get?page=1&limit=10");
      
      console.log("SERVER CHECK:", transRes.data);

      // Extract array from response
      let list = [];
      if (transRes.data && Array.isArray(transRes.data.data)) {
        list = transRes.data.data;
      } else if (Array.isArray(transRes.data)) {
        list = transRes.data;
      }
      
      setTransactions(list);

    } catch (error) {
      console.error("Fetch Error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !report) return <Loader />;

  const summary = report?.summary || { totalCredit: 0, totalDebit: 0, balance: 0 };
  
  // Calculate totals from transactions if report doesn't have proper data
  const calculatedCredit = transactions.filter(t => t.transactionType === "cr").reduce((sum, t) => sum + (t.amount || 0), 0);
  const calculatedDebit = transactions.filter(t => t.transactionType === "dr").reduce((sum, t) => sum + (t.amount || 0), 0);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">My Financial Report</h1>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadData} 
          type="primary"
          ghost
        >
          Refresh Data
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md rounded-xl text-center border-t-4 border-green-500">
          <p className="text-gray-500 uppercase text-xs font-semibold">Total Credit</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{summary.totalCredit || calculatedCredit}
          </h2>
        </Card>

        <Card className="shadow-md rounded-xl text-center border-t-4 border-red-500">
          <p className="text-gray-500 uppercase text-xs font-semibold">Total Debit</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            ₹{summary.totalDebit || calculatedDebit}
          </h2>
        </Card>

        <Card className="shadow-md rounded-xl text-center border-t-4 border-blue-500">
          <p className="text-gray-500 uppercase text-xs font-semibold">Balance</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ₹{summary.balance || (calculatedCredit - calculatedDebit)}
          </h2>
        </Card>
      </div>

      <Card title="Recent Transactions" className="shadow-lg rounded-xl">
        {transactions.length === 0 ? (
          <Empty description="No transactions found. Try clicking Refresh." />
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{t.title || "No Title"}</p>
                  <p className="text-xs text-gray-400">
                    {t.transactionType === "cr" ? "CREDIT" : "DEBIT"} • {t.paymentMethod} • {t.notes}
                  </p>
                </div>

                <div className={`font-bold text-lg ${t.transactionType === "cr" ? "text-green-500" : "text-red-500"}`}>
                  {t.transactionType === "cr" ? "+" : "-"} ₹{t.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Report;