import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const logData = [
  "[2025-04-22 19:47:47] INFO: User Unknown made a POST request to /api/auth/login → Status 200 (323ms)",
  "[2025-04-22 19:47:47] INFO: User Unknown made a GET request to /api/subscription → Status 200 (132ms)",
  "[2025-04-22 19:47:47] INFO: User Unknown made a GET request to /api/subscription → Status 304 (196ms)",
  "[2025-04-22 19:48:11] INFO: User 647d3077-8d8b-4103-81b8-4f25f34cdb62 made a GET request to /api/fintech/transactions → Status 200 (1653ms)",
  "[2025-04-22 19:48:12] INFO: User 647d3077-8d8b-4103-81b8-4f25f34cdb62 made a GET request to /api/fintech/transactions → Status 304 (424ms)",
  // You can add the rest of the logs here or load them from an API
];

function AdminLogs() {

    const [logs,setLogs] = useState([])

    useEffect(()=>{

        const fetch = async ()=>{

            try{
                const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:8000/api/admin/logs", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLogs(response.data.logs);
}
catch(e){
    toast.error("Unable to fetch logs. Please try again later")
}
}

fetch()
    },[ ])

    

    const downloadLogs = () => {
        const blob = new Blob([logs.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "server-logs.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    
      return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
          <h1 className="text-center font-extrabold text-accent text-4xl my-4">Server Logs</h1>
          <div className="h-[80vh] overflow-y-scroll border my-3 custom-scroll border-accent p-5 rounded-2xl"
            // style={{
            //   whiteSpace: 'pre-wrap',
            //   backgroundColor: '#f5f5f5',
            //   padding: '1rem',
            //   border: '1px solid #ddd',
            //   borderRadius: '8px',
            //   maxHeight: '400px',
            //   overflowY: 'auto',
            //   marginBottom: '1rem',
            // }}
          >
            {logs.map((v,i)=>(
                <div>{v} </div>
            ))}
          </div>
          <button 
            onClick={downloadLogs}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
            //   backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
            className="m-auto bg-accent"
          >
            Download Logs
          </button>
        </div>
      );
}

export default AdminLogs;
