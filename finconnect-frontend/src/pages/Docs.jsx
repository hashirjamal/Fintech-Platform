import React, { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/Context";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Documentation() {
  const { setCurrentPage } = useContext(UserContext);
  
  useEffect(() => {
    setCurrentPage("docs");
  }, [setCurrentPage]);

  const endpoints = [
    {
      title: "Get Balance",
      endpoint: "/api/fintech/balance",
      method: "GET",
      description: "Retrieve the current balance for your account.",
      params: [],
      headers: [
        { name: "x-api-key", description: "Your API Key" }
      ],
      responseExample: `{
  "balance": 5000
}`,
      codeExample: `const getBalance = async () => {
  try {
    const response = await fetch('https://finconnect.com/api/fintech/balance', {
      method: 'GET',
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    });
    
    const data = await response.json();
    console.log('Balance:', data.balance);
    return data;
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
};`
    },
    {
      title: "Transfer Funds",
      endpoint: "/api/fintech/transfer",
      method: "POST",
      description: "Transfer funds from your account to another user's account.",
      params: [
        { name: "accountNumber", description: "Recipient's account number" },
        { name: "amount", description: "Amount to transfer" }
      ],
      headers: [
        { name: "x-api-key", description: "Your API Key" }
      ],
      responseExample: `{
  "message": "Transfer successful"
}`,
      codeExample: `const transferFunds = async (accountNumber, amount) => {
  try {
    const response = await fetch('https://finconnect.com/api/fintech/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY'
      },
      body: JSON.stringify({
        accountNumber,
        amount
      })
    });
    
    const data = await response.json();
    console.log('Transfer result:', data.message);
    return data;
  } catch (error) {
    console.error('Error transferring funds:', error);
  }
};`
    },
    {
      title: "Transaction History",
      endpoint: "/api/fintech/transactions",
      method: "GET",
      description: "Retrieve your transaction history with pagination.",
      params: [
        { name: "page", description: "Page number (default: 1)" },
        { name: "pageLimit", description: "Number of transactions per page (default: 10)" }
      ],
      headers: [
        { name: "x-api-key", description: "Your API Key" }
      ],
      responseExample: `{
  "transactions": {
    "count": 25,
    "rows": [
      {
        "transactionId": "123456",
        "senderAccount": "1001001001",
        "receiverAccount": "2002002002",
        "amount": 500,
        "status": "completed",
        "createdAt": "2025-04-20T12:34:56.789Z",
        "sender": {
          "name": "John Doe",
          "email": "john@example.com",
          "accountNumber": "1001001001"
        },
        "receiver": {
          "name": "Jane Smith",
          "email": "jane@example.com",
          "accountNumber": "2002002002"
        }
      },
      // More transactions...
    ]
  }
}`,
      codeExample: `const getTransactionHistory = async (page = 1, pageLimit = 10) => {
  try {
    const response = await fetch(
      \`https://finconnect.com/api/fintech/transactions?page=\${page}&pageLimit=\${pageLimit}\`, 
      {
        method: 'GET',
        headers: {
          'x-api-key': 'YOUR_API_KEY'
        }
      }
    );
    
    const data = await response.json();
    console.log('Transactions:', data.transactions);
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};`
    },
    {
      title: "Invoice History",
      endpoint: "/api/fintech/invoice",
      method: "GET",
      description: "Retrieve invoices for a specific date range.",
      params: [
        { name: "start", description: "Start date (YYYY-MM-DD)" },
        { name: "end", description: "End date (YYYY-MM-DD)" }
      ],
      headers: [
        { name: "x-api-key", description: "Your API Key" }
      ],
      responseExample: `{
  "totalAmount": 1500,
  "totalTransactions": 3,
  "invoices": [
    {
      "transactionId": "123456",
      "senderAccount": "1001001001",
      "receiverAccount": "2002002002",
      "amount": 500,
      "status": "completed",
      "createdAt": "2025-04-20T12:34:56.789Z"
    },
    // More invoices...
  ]
}`,
      codeExample: `const getInvoiceHistory = async (startDate, endDate) => {
  try {
    const response = await fetch(
      \`https://finconnect.com/api/fintech/invoice?start=\${startDate}&end=\${endDate}\`, 
      {
        method: 'GET',
        headers: {
          'x-api-key': 'YOUR_API_KEY'
        }
      }
    );
    
    const data = await response.json();
    console.log('Invoice data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching invoice history:', error);
  }
};`
    }
  ];

  return (
    <div className="bg-background text-textPrimary min-h-screen sm:p-8">
      <div className="max-w-6xl sm:mx-auto">
        <div className="bg-surface rounded-lg shadow-glow-accent sm:p-8 mb-8">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" className="w-20 h-20 mb-4" alt="FinConnect Logo" />
            <h1 className="text-4xl font-bold text-white">
              <span className="text-accent">F</span>in
              <span className="text-accent">C</span>onnect API
              <span className="text-accent"> Documentation</span>
            </h1>
            <p className="text-lg mt-4 text-textSecondary text-center">
              Build, test, and integrate financial applications with our secure, subscription-controlled mock APIs.
            </p>
          </div>

          <div className="bg-[#1b1c20] border border-accent p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-accent mb-2">Authentication</h2>
            <p className="mb-4">
              All API requests must include your API key in the <code className="bg-gray-800 px-1 rounded">x-api-key</code> header.
              You can generate your API key from the Dashboard page after subscribing to a plan.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <SyntaxHighlighter language="javascript" style={dark}>
                {`// Example using fetch
const response = await fetch('https://finconnect.com/api/fintech/balance', {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="bg-[#1b1c20] border border-accent p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-accent mb-2">Rate Limits</h2>
            <p>
              API request limits depend on your subscription plan. When you exceed your rate limit,
              the API will return a <code className="bg-gray-800 px-1 rounded">429 Too Many Requests</code> response.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-accent mb-6">API Endpoints</h2>

          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-[#1b1c20] border border-accent p-6 rounded-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{endpoint.title}</h3>
                <div className="flex items-center mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-lg mr-2 ${
                    endpoint.method === 'GET' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="bg-gray-800 px-3 py-1 rounded-lg font-mono text-sm">
                    {endpoint.endpoint}
                  </code>
                </div>
              </div>
              
              <p className="mb-4 text-textSecondary">{endpoint.description}</p>
              
              {endpoint.params.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-accent mb-2">Parameters</h4>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-textSecondary">Name</th>
                          <th className="text-left pb-2 text-textSecondary">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.params.map((param, i) => (
                          <tr key={i}>
                            <td className="pr-4 py-1"><code>{param.name}</code></td>
                            <td className="text-textSecondary">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-accent mb-2">Headers</h4>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-2 text-textSecondary">Name</th>
                        <th className="text-left pb-2 text-textSecondary">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.headers.map((header, i) => (
                        <tr key={i}>
                          <td className="pr-4 py-1"><code>{header.name}</code></td>
                          <td className="text-textSecondary">{header.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium text-accent mb-2">Example Request</h4>
                  <div className="bg-gray-800 p-4 rounded-lg h-full">
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {endpoint.codeExample}
                    </SyntaxHighlighter>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-accent mb-2">Example Response</h4>
                  <div className="bg-gray-800 p-4 rounded-lg h-full">
                    <SyntaxHighlighter language="json" style={dark}>
                      {endpoint.responseExample}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-lg shadow-glow-accent p-8">
          <h2 className="text-2xl font-bold text-accent mb-4">Error Handling</h2>
          <p className="mb-4">
            When an error occurs, the API will return an appropriate HTTP status code and a JSON object with error details.
          </p>
          
          <div className="bg-[#1b1c20] p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-accent mb-2">Example Error Response</h3>
            <SyntaxHighlighter language="json" style={dark}>
              {`{
  "error": {
    "message": "Insufficient funds",
    "status": 400
  }
}`}
            </SyntaxHighlighter>
          </div>
          
          <h3 className="text-lg font-medium text-accent mb-2">Common Error Codes</h3>
          <div className="bg-[#1b1c20] p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-2 text-textSecondary">Status Code</th>
                  <th className="text-left pb-2 text-textSecondary">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pr-4 py-2"><code>400</code></td>
                  <td className="text-textSecondary">Bad Request - Missing required parameters or invalid values</td>
                </tr>
                <tr>
                  <td className="pr-4 py-2"><code>401</code></td>
                  <td className="text-textSecondary">Unauthorized - Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="pr-4 py-2"><code>403</code></td>
                  <td className="text-textSecondary">Forbidden - You don't have permission for this operation</td>
                </tr>
                <tr>
                  <td className="pr-4 py-2"><code>404</code></td>
                  <td className="text-textSecondary">Not Found - Resource not found</td>
                </tr>
                <tr>
                  <td className="pr-4 py-2"><code>429</code></td>
                  <td className="text-textSecondary">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="pr-4 py-2"><code>500</code></td>
                  <td className="text-textSecondary">Internal Server Error - Something went wrong on our end</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;