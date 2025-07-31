import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/activity-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err?.response?.data || err.message);
        toast.error("Failed to load activity logs.");
      }
    };
    fetchLogs();
  }, []);

  // Handle row coloring based on severity (extendable)
  const getRowColor = (severity) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warn":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const username = log.user?.username?.toLowerCase() || "";
    const email = log.user?.email?.toLowerCase() || "";
    return (
      username.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const downloadCSV = () => {
    const csv = unparse(
      filteredLogs.map((log) => ({
        Username: log.user?.username || "Guest",
        Email: log.user?.email || "—",
        Action: log.action,
        IP: log.ip === "::1" ? "127.0.0.1 (localhost)" : log.ip,
        Device: log.userAgent,
        Time: new Date(log.timestamp).toLocaleString(),
        Severity: log.severity || "info",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "activity_logs.csv");
  };

  return (
    <div className="p-6 font-[Poppins]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-full md:w-64"
          />
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded border border-gray-300">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Action</th>
              <th className="border p-2 text-left">IP</th>
              <th className="border p-2 text-left">Device</th>
              <th className="border p-2 text-left">Time</th>
              <th className="border p-2 text-left">Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} className={`${getRowColor(log.severity)} hover:bg-gray-50`}>
                  <td className="border p-2">{log.user?.username || "Guest"}</td>
                  <td className="border p-2">{log.user?.email || "—"}</td>
                  <td className="border p-2">{log.action}</td>
                  <td className="border p-2">
                    {log.ip === "::1" ? "127.0.0.1 (localhost)" : log.ip}
                  </td>
                  <td className="border p-2">{log.userAgent}</td>
                  <td className="border p-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="border p-2 capitalize">
                    {log.severity || "info"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
