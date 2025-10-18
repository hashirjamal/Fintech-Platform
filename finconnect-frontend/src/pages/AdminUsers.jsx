import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/Context";
import axios from "axios";
import Modal2 from "../components/Modal2";

function AdminUsers() {
  const { setCurrentPage } = useContext(UserContext);
const [open,setOpen] = useState(false)

  const [users, setUsers] = useState([
    {
      accountNumber: "d4f1a6b2-3c6b-48f9-bc22-11e321d6e0a1",
      name: "Hashir Ali",
      email: "hashir@example.com",
      role: "admin",
      isSubscribed: true,
    },
    {
      accountNumber: "a7d8b5f9-2a3e-44c0-95f2-3c22b9ea331a",
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      role: "developer",
      isSubscribed: false,
    },
    {
      accountNumber: "b1c9a0e4-8c90-4f3e-9021-17db1d7c8f89",
      name: "Zain Raza",
      email: "zain@example.com",
      role: "developer",
      isSubscribed: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage("admin-users");
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token)

      const response = await axios.get("http://localhost:8000/api/admin/users", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (accountNumber) => {
    // You can add your logic here
    setOpen(true)
    console.log("Deleting user with accountNumber:", accountNumber);
  };

  return (
    <div className="flex flex-col  items-center min-h-[95vh] bg-background text-textPrimary mt-4 px-4">
      <h1 className="text-4xl font-semibold mb-6 text-accent text-center">
        Manage Users
      </h1>


      <div className="w-full overflow-x-auto bg-surface rounded-lg shadow-glow-accent p-4">
        {loading ? (
          <p className="text-center text-textSecondary">Loading users...</p>
        ) : users?.length === 0 ? (
          <p className="text-center text-textSecondary">No users found.</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-accent text-white">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Subscribed</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.accountNumber}
                  className="border-b border-textSecondary/20 hover:bg-background/20 transition-all"
                >
                    {open && <Modal2 setOpen={setOpen} text={""} title={"Are you sure you want to delete this user"} buttonText={"DELETE"} userId={user.accountNumber} />}
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">
                    {user.isSubscribed ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(user.accountNumber)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
