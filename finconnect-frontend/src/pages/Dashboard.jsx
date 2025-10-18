import React, { useEffect, useState, useContext } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardLine from "../components/DashboardLine";
import PieChart from "../components/PieChart";
import TransactionLogs from "../components/TransactionLogs";
import { UserContext } from "../context/Context";
import Modal from "../components/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const Page = () => {
  const [cardDetails, setCardDetails] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    setCurrentPage,
    isSubscribed,
    isAdmin,
    logout,
    user,
    setUserinLocalStorage,
  } = useContext(UserContext);

  const token = localStorage.getItem("token");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const fetchDashboardData = async () => {
    try {
      {
        if (isAdmin) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/admin/stats`,
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (response.status === 200) {
              console.log(response.data);
              return setCardDetails(response.data);
            } else {
              return toast.error("Error fetching dashboard data");
            }
          } catch (err) {
            console.log(err);
            return toast.error(err?.response?.data?.message);
          }
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/dashboard/getDashboard/${
          user?.accountNumber
        }`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCardDetails(response.data.cardDetails);
        console.log(cardDetails);
      } else {
        toast.error("Error fetching dashboard data");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    setCurrentPage("dashboard");
  }, [setCurrentPage]);
  console.log(user)
  const generateAPIKey = async () => {
    setIsGenerating(true);
    if(!(JSON.parse(localStorage.getItem("user")).isSubscribed)) toast.error("Looks like you are not subscribed. Please log in again if you are susbscribed")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/key/generate`,
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUserinLocalStorage({ ...user, apiKey: response.data?.apiKey });
        setApiKey(response.data?.apiKey);
      } else {
        toast.error("Error generating API Key");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsGenerating(false);
  };

  const formatDate = (date) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  const fetchInvoiceHistory = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    setLoadingInvoice(true);
    try {
      console.log(user);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/fintech/invoice?start=${formatDate(startDate)}&end=${formatDate(
          endDate
        )}`,
        {
          withCredentials: true,
          headers: {
            "x-api-key": user.apiKey,
          },
        }
      );
      if (response.status === 200) {
        setInvoiceData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Error fetching invoice data."
      );
    }
    setLoadingInvoice(false);
  };

  const generatePDF = () => {
    if (!invoiceData) {
      toast.error("No invoice data available for PDF generation.");
      return;
    }

    const doc = new jsPDF();

    const primaryColor = [30, 39, 46]; // Dark slate
    const accentColor = [192, 156, 98]; // Gold
    const lightColor = [250, 250, 250]; // Off-white
    const borderColor = [220, 220, 220]; // Light gray

    doc.setFont("helvetica", "normal");

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(...accentColor);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TRANSACTION STATEMENT", 105, 25, { align: "center" });

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text("FinConnect Services", 105, 32, { align: "center" });

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    const dateText = `${formatDate(startDate)}  —  ${formatDate(endDate)}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, 105, 50, { align: "center" });
    doc.setDrawColor(...accentColor);
    doc.line(105 - dateWidth / 2, 52, 105 + dateWidth / 2, 52);

    let y = 65;

    invoiceData.invoices.forEach((invoice, index) => {
      doc.setDrawColor(...borderColor);
      doc.setFillColor(...lightColor);
      doc.roundedRect(20, y, 170, 50, 2, 2, "FD");

      doc.setDrawColor(...accentColor);
      doc.line(20, y, 190, y);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(`#${invoice.transactionId}`, 25, y + 8);

      doc.text(invoice.createdAt, 185, y + 8, { align: "right" });

      doc.setTextColor(...primaryColor);
      doc.setFontSize(10);

      doc.setFont("helvetica", "bold");
      doc.text("From:", 25, y + 20);
      doc.text("To:", 25, y + 30);

      doc.setFont("helvetica", "normal");
      doc.text(invoice.senderAccount, 45, y + 20);
      doc.text(invoice.receiverAccount, 45, y + 30);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentColor);
      doc.setFontSize(14);

      doc.setFillColor(252, 243, 227);
      doc.circle(160, y + 25, 15, "F");

      doc.text(`$${invoice.amount}`, 160, y + 28, { align: "center" });

      doc.setFillColor(214, 234, 214);
      doc.roundedRect(130, y + 38, 50, 8, 4, 4, "F");
      doc.setTextColor(50, 120, 50);
      doc.setFontSize(8);
      doc.text("COMPLETED", 155, y + 42, { align: "center" });

      y += 60;

      if (y > 250) {
        doc.addPage();
        y = 20;

        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 20, "F");
        doc.setTextColor(...accentColor);
        doc.setFontSize(12);
        doc.text("— Continued —", 105, 15, { align: "center" });
        doc.setTextColor(0, 0, 0);
      }
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, 105, 290, {
        align: "center",
      });

      doc.setTextColor(230, 230, 230);
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");

      doc.setTextColor(0, 0, 0);
    }

    doc.setPage(totalPages);
    doc.setTextColor(...accentColor);
    doc.setFontSize(12);
    doc.text("Thank you for your business", 105, 275, { align: "center" });

    doc.save(
      `Transaction_Statement_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#1a1c1ff8] rounded-lg text-white min-h-screen p-8">
      {isSubscribed || isAdmin ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl text-center mb-3">
              Welcome,{" "}
              <span className="text-accent font-bold">{user?.name}</span>
              <p className="text-lg text-accent">{user?.accountNumber}</p>
            </h1>
          </div>
          {!isAdmin && (
            <div className="flex justify-center items-center mb-4">
              <button
                onClick={async () => {
                  await generateAPIKey();
                  setOpen(true);
                }}
                className="relative flex items-center justify-center gap-2 bg-accent rounded-lg py-2 px-4 text-white hover:bg-accentHover transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Generate API Key"
                )}
              </button>
            </div>
          )}
          {open && (
            <Modal
              title={"API KEY"}
              text="Here is your API_KEY. Copy this key as it won't be visible to you next time."
              buttonText="Log Out"
              action={() => {
                logout();
              }}
              setOpen={setOpen}
              apiKey={apiKey}
            />
          )}
          <div className="grid md:grid-cols-4 grid-cols-1 auto-rows-auto gap-2">
            {cardDetails?.map((card, index) => (
              <div key={index} className="md:h-40 h-32">
                <DashboardCard card={card} />
              </div>
            ))}
            <div className="md:row-span-2 md:col-span-3 bg-[#1b1c20] rounded-lg">
              <DashboardLine />
            </div>
            {isAdmin ? (
              <div className="bg-[#1b1c20] border-accent border md:row-span-2 rounded-lg p-4">
                <PieChart />
              </div>
            ) : (
              <div className="bg-[#1b1c20] border-accent border md:row-span-2 rounded-lg p-4">
                <TransactionLogs />
              </div>
            )}
          </div>
          {user?.Subscription?.invoice && (
            <div className="bg-[#1b1c20] border border-accent mt-4 shadow-xl rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold text-accent mb-4">
                Generate Invoice
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                  <label>Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="p-2 rounded text-white border border-accent  h-8 mx-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div>
                  <label>End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="p-2 rounded text-white border border-accent h-8 mx-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <button
                  onClick={fetchInvoiceHistory}
                  className="bg-accent text-white px-4 py-1 hover:cursor-pointer rounded hover:bg-accentHover h-8"
                  disabled={loadingInvoice}
                >
                  {loadingInvoice ? "Loading..." : "Fetch Invoice"}
                </button>
                {invoiceData && (
                  <button
                    onClick={generatePDF}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <h1 className="text-3xl text-accent">
            You should be Subscribed user and Logged In to access the dashboard
          </h1>
          <p className="text-textPrimary text-lg mt-4">
            You can go to the{" "}
            <a href="/" className="text-accent hover:underline">
              Home Page
            </a>{" "}
            or{" "}
            <a href="/pricing" className="text-accent hover:underline">
              Pricing Page
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
