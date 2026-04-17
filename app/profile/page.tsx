"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import TopNavbar from "@/components/TopNavbar";
import SelectSearch from "@/components/SelectSearch";
import MenuBars from "@/components/MenuBars";

type OptionType = {
  label: string;
  value: string;
  area_code: string;
  postcode: string; // Tambahkan ini
  zone_type: string; // Tambahkan ini
};

interface Address {
  id: number;
  area: OptionType | null;
  address: string;
}

export default function ProfileSettingsPage() {
  const [customerCode, setCustomerCode] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [phoneCompany, setPhoneCompany] = useState("");
  const [website, setWebsite] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, area: null, address: "" },
    { id: 2, area: null, address: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingFetch(true);

        // ✅ ambil session dulu
        const sessionRes = await fetch("/api/auth/me");
        const session = await sessionRes.json();

        if (!sessionRes.ok) throw new Error("Unauthorized");

        setCustomerCode(session.customer_code);
        setEmail(session.email);

        // ✅ fetch customer pakai customer_code
        const res = await fetch(`/api/customers/${session.customer_code}`);

        if (!res.ok) throw new Error("Failed fetch");

        const data = await res.json();

        setFullName(data.pic_name ?? "");
        setPhone(data.pic_phone ?? "");

        setCompanyName(data.company_name ?? "");
        setPhoneCompany(data.phone ?? "");
        setWebsite(data.website ?? "");

        setAddresses([
          {
            id: 1,
            area: data.pickupArea
              ? {
                  label: data.pickupArea.suburb,
                  value: data.pickupArea.suburb,
                  area_code: data.pickupArea.area_code,
                  postcode: data.pickupArea.postcode, // Tambahkan ini
                  zone_type: data.pickupArea.zone_type, // Tambahkan ini
                }
              : null,
            address: data.pickup_address ?? "",
          },
          {
            id: 2,
            area: data.officeArea
              ? {
                  label: data.officeArea.suburb,
                  value: data.officeArea.suburb,
                  area_code: data.officeArea.area_code,
                  postcode: data.officeArea.postcode, // Tambahkan ini
                  zone_type: data.officeArea.zone_type, // Tambahkan ini
                }
              : null,
            address: data.office_address ?? "",
          },
        ]);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLE =================
  const handleAddressChange = (
    id: number,
    field: keyof Address,
    value: any,
  ) => {
    setAddresses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        pic_name: fullName,
        pic_phone: phone,
        email,

        company_name: companyName,
        phone: phoneCompany,
        website,

        pickup_area_code: addresses[0]?.area?.area_code || null,
        pickup_address: addresses[0]?.address || "",

        office_area_code: addresses[1]?.area?.area_code || null,
        office_address: addresses[1]?.address || "",
      };

      const res = await fetch(`/api/customers/${customerCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error);
      }

      // alert("Saved successfully!");
      toast.success("Saved successfully!");
      setShowAlert(!showAlert);
    } catch (err) {
      console.error(err);
      // alert("Failed to save data");
      toast.success("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />
      <Toaster position="top-right" />

      <div className="p-6 px-16 ">
        {showAlert && (
          <div className="mx-6 mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
            <span>✅ Congratulation ! profile have been change.</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 space-y-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>

          {/* PERSONAL */}
          <div className="bg-white p-6 rounded-xl border grid md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="">Pic Name * :</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="p-3 border rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Email * :</label>
              <input
                value={email}
                disabled
                className="p-3 border rounded-xl bg-gray-300"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Pic Phone * :</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="p-3 border rounded-xl"
              />
            </div>
          </div>

          {/* COMPANY */}
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <h1 className="text-lg font-semibold">Company Detail</h1>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="">Company Name * :</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="p-3 border rounded-xl"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="">Company Phone * :</label>
                <input
                  value={phoneCompany}
                  onChange={(e) => setPhoneCompany(e.target.value)}
                  placeholder="Company Phone"
                  className="p-3 border rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">Website :</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website"
                  className="p-3 border rounded-xl"
                />
              </div>
            </div>

            {addresses.map((addr) => (
              <div key={addr.id} className="border p-4 rounded-xl">
                <SelectSearch
                  label={addr.id === 1 ? "Pickup Area *" : "Office Area *"}
                  value={addr.area || undefined}
                  onChange={(val) => handleAddressChange(addr.id, "area", val)}
                />

                <input
                  value={addr.address}
                  onChange={(e) =>
                    handleAddressChange(addr.id, "address", e.target.value)
                  }
                  className="border p-2 rounded-lg w-full mt-2"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={loading || loadingFetch}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
