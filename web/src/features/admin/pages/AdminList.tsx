
import { mockManufacturerAdmins } from "../../../shared/mock/manufacturerAdmins";
import { useState } from "react";

function AdminList() {

  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState(mockManufacturerAdmins);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleSave = () => {
    if (!editingAdmin) return;

    const updatedAdmins = admins.map((admin) =>
      admin.userId === editingAdmin.userId
        ? { ...admin, ...editForm }
        : admin
    );

    setAdmins(updatedAdmins);
    setEditingAdmin(null);
  };
  const handleDelete = (adminId: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this administrator?"
  );

  if (!confirmDelete) return;

  setAdmins((currentAdmins) =>
    currentAdmins.filter((admin) => admin.userId !== adminId)
  );

  if (selectedAdmin?.userId === adminId) {
    setSelectedAdmin(null);
  }

  if (editingAdmin?.userId === adminId) {
    setEditingAdmin(null);
  }
};

  const handleAdd = () => {
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.phone) {
      alert("Please fill in Full Name, Email and Phone.");
      return;
    }

    const currentDate = new Date().toISOString();

    const adminToAdd = {
      userId: crypto.randomUUID(),
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      phone: newAdmin.phone,
      nic: newAdmin.nic || null,
      role: "MANUFACTURING_ADMIN" as const,
      accountStatus: "ACTIVE" as const,
      line1: newAdmin.line1,
      city: newAdmin.city,
      district: newAdmin.district,
      lastLoginAt: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    setAdmins([...admins, adminToAdd]);

    setNewAdmin({
      fullName: "",
      email: "",
      phone: "",
      nic: "",
      line1: "",
      city: "",
      district: "",
    });

    setShowAddForm(false);
    setSelectedStatus("ALL");
    setSearchTerm("");
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    line1: "",
    city: "",
    district: "",
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedAdmin, setSelectedAdmin] = useState<
    (typeof mockManufacturerAdmins)[0] | null
  >(null);
  const [editingAdmin, setEditingAdmin] = useState<
    (typeof mockManufacturerAdmins)[0] | null
  >(null);
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" ||
      admin.accountStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manufacturer Administrators
          </h1>

          <p className="mt-2 text-slate-600">
            Manage manufacturer administrator accounts.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Admin
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="mt-6 w-full rounded-lg border border-slate-300 p-3"

      /><select
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        className="mt-4 w-full rounded-lg border border-slate-300 p-3"
      >
        <option value="ALL">All Admins</option>
        <option value="ACTIVE">Active Admins</option>
        <option value="INACTIVE">Inactive Admins</option>
      </select>

      <p className="mt-4 text-sm text-slate-600">
        Showing {filteredAdmins.length} of {admins.length} administrators
      </p>
      {showAddForm && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Add New Manufacturer Admin
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={newAdmin.fullName}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, fullName: event.target.value })
                }
                placeholder="Enter full name"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, email: event.target.value })
                }
                placeholder="Enter email"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone
              </label>
              <input
                type="text"
                value={newAdmin.phone}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, phone: event.target.value })
                }
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                NIC
              </label>
              <input
                type="text"
                value={newAdmin.nic}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, nic: event.target.value })
                }
                placeholder="Enter NIC"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                value={newAdmin.line1}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, line1: event.target.value })
                }
                placeholder="Enter address"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                City
              </label>
              <input
                type="text"
                value={newAdmin.city}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, city: event.target.value })
                }
                placeholder="Enter city"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                District
              </label>
              <input
                type="text"
                value={newAdmin.district}
                onChange={(event) =>
                  setNewAdmin({ ...newAdmin, district: event.target.value })
                }
                placeholder="Enter district"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Save Admin
            </button>

            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse bg-white text-left">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.userId} className="border-b">
                  <td className="p-3">{admin.fullName}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.phone}</td>
                  <td className="p-3">{admin.city}</td>
                  <td className="p-3">{admin.accountStatus}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setEditingAdmin(admin);

                        setEditForm({
                          fullName: admin.fullName,
                          email: admin.email ?? "",
                          phone: admin.phone,
                        });
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
  onClick={() => handleDelete(admin.userId)}
  className="ml-3 text-red-600 hover:underline"
>
  Delete
</button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No administrators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedAdmin && (
        <div className="mt-6 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold">
            Admin Details
          </h2>

          <p className="mt-3">
            <strong>Name:</strong> {selectedAdmin.fullName}
          </p>

          <p>
            <strong>Email:</strong> {selectedAdmin.email}
          </p>

          <p>
            <strong>Phone:</strong> {selectedAdmin.phone}
          </p>

          <p>
            <strong>NIC:</strong> {selectedAdmin.nic || "Not provided"}
          </p>

          <p>
            <strong>City:</strong> {selectedAdmin.city}
          </p>

          <p>
            <strong>Status:</strong> {selectedAdmin.accountStatus}
          </p>

          <button
            onClick={() => setSelectedAdmin(null)}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      )}
      {editingAdmin && (
        <div className="mt-6 rounded-lg border bg-white p-5">
          <h2 className="text-xl font-bold">Edit Admin</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(event) =>
                  setEditForm({ ...editForm, fullName: event.target.value })
                }
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(event) =>
                  setEditForm({ ...editForm, email: event.target.value })
                }
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(event) =>
                  setEditForm({ ...editForm, phone: event.target.value })
                }
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingAdmin(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminList;
