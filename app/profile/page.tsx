"use client";

import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

interface Address {
  id: number;
  label: string;
  address: string;
}

export default function ProfileSettingsPage() {
  // 🔥 kosongin semua (no dummy)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [phoneCompany, setPhoneCompany] = useState(""); // optional
  const [website, setWebsite] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);

  // ================= FETCH FROM API =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/customers/CUST001");
        const data = await res.json();

        console.log("API RESULT:", data);

        if (!data) return;

        // 🔥 PERSONAL
        setFullName(data.pic_name || "");
        setEmail(data.email || "");
        setPhone(data.pic_phone || "");
        setPhoneCompany(data.phone || "");

        // 🔥 COMPANY
        setCompanyName(data.company_name || "");
        setWebsite(data.website || "");
        setBusinessAddress(data.office_address || "");

        // 🔥 ADDRESS + JOIN
        setAddresses([
          {
            id: 1,
            label: data.pickupArea
              ? `Pickup Warehouse : ${data.pickupArea.suburb}, ${data.pickupArea.state}`
              : "Pickup Warehouse",
            address: data.pickup_address || "",
          },
          {
            id: 2,
            label: data.officeArea
              ? `Store / Company : ${data.officeArea.suburb}, ${data.officeArea.state}`
              : "Store / Company",
            address: data.office_address || "",
          },
        ]);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleAddressChange = (
    id: number,
    field: "label" | "address",
    value: string,
  ) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr,
      ),
    );
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const payload = {
      pic_name: fullName,
      pic_phone: phone,
      email,
      phone,
      company_name: companyName,
      website,
      pickup_address: addresses[0]?.address,
      office_address: addresses[1]?.address,
    };

    console.log("PAYLOAD:", payload);

    const res = await fetch("/api/customers/CUST001", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Changes saved!");
    } else {
      alert("Failed to save");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />
      <div className="px-6">
        <div className="p-6 px-16 space-y-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-gray-500 text-sm">
            Manage your account and company information
          </p>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border">
            <h2 className="font-semibold flex items-center gap-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="p-3 border rounded-xl bg-gray-100"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border rounded-xl bg-gray-100"
              />
              <input
                type="tel"
                value={phoneCompany}
                onChange={(e) => setPhoneCompany(e.target.value)}
                className="p-3 border rounded-xl bg-gray-100"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border">
            <h2 className="font-semibold flex items-center gap-2">
              Company Information
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="p-3 border rounded-xl bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-3 border rounded-xl bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label>Email</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="p-3 border rounded-xl bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex justify-between items-center border p-3 rounded-xl"
                >
                  <div className="flex flex-col gap-1 w-[90%]">
                    <input
                      type="text"
                      value={addr.label}
                      onChange={(e) =>
                        handleAddressChange(addr.id, "label", e.target.value)
                      }
                      className="font-semibold border-b bg-transparent focus:outline-none"
                    />
                    <input
                      type="text"
                      value={addr.address}
                      onChange={(e) =>
                        handleAddressChange(addr.id, "address", e.target.value)
                      }
                      className="text-gray-500 border-b bg-transparent focus:outline-none"
                    />
                  </div>
                  <button className="text-blue-500 hover:underline w-[10%]">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
