import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/Context";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const TransactionLogs = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const { user } = useContext(UserContext);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/fintech/transactions?page=${page}`,
          {
            withCredentials: true,
            headers: {
              "x-api-key": user.apiKey,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPageCount(Math.ceil(response.data?.transactions?.count / 5) || 0);
        setData(response.data?.transactions?.rows);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchLogs();
  }, [page, user.apiKey]);

  return (
    <div>
      <h2 className="relative text-accent font-bold lg:text-3xl text-xl mb-4 text-center">
        Transaction Logs
      </h2>

      <div className="w-full grid grid-cols-1 custom-scroll gap-2 justify-center overflow-y-auto md:max-h-[23rem] max-h-[20rem]">
        {data?.map((item, index) => (
          <div
            className="bg-transparent px-2 py-1 w-full rounded-lg shadow-xl flex flex-col justify-between "
            key={index}
          >
            <h1 className="text-accent text-md">
              {item?.sender?.name} <span className="text-white">to</span>{" "}
              <span className="italic">{item?.receiver?.name}</span>
            </h1>
            <h2>
              Amount: {item.amount}{" "}
              <span className="text-textSecondary italic">{item.status}</span>
            </h2>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 items-center mt-4">
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accentHover transition duration-300"
          disabled={page <= 1}
          onClick={() => {
            if (page > 1) {
              setPage((prev) => prev - 1);
            }
          }}
        >
          <FaChevronLeft className="text-lg" />
        </button>
        <span className="text-white text-lg">
          Page {page} of {pageCount}
        </span>
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accentHover transition duration-300"
          disabled={page >= pageCount}
          onClick={() => {
            if (page < pageCount) {
              setPage((prev) => prev + 1);
            }
          }}
        >
          <FaChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
};
export default TransactionLogs;
