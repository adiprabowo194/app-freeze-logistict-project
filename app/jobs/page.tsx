"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";
import InputField from "@/components/InputField";
import SelectSearch from "@/components/SelectSearch";
import SelectField from "@/components/SelectField";
import Button from "@/components/Button";
import TextareaField from "@/components/TextareaField";

type Option = {
  label: string;
  value: string;
  area_code: string;
};

function Page() {
  const [pickupSuburb, setPickupSuburb] = useState<Option | null>(null);
  const [deliverySuburb, setDeliverySuburb] = useState<Option | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [cargoTemp, setCargoTemp] = useState("");
  const [cargoUnit, setCargoUnit] = useState("");
  const [qty, setQty] = useState("");
  const [weight, setWeight] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [cargoCategory, setCargoCategory] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitCargo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupSuburb?.area_code)
      return toast.error("Please select Pickup Suburb");
    if (!deliverySuburb?.area_code)
      return toast.error("Please select Delivery Suburb");
    if (!cargoTemp) return toast.error("Please select Cargo Temperature");
    if (!cargoUnit) return toast.error("Please select Unit");
    if (!qty || Number(qty) <= 0)
      return toast.error("Qty must be greater than 0");
    if (!weight || Number(weight) <= 0)
      return toast.error("Weight must be greater than 0");
    if (!pickupDate) return toast.error("Please select Pickup Date");
    if (!cargoCategory) return toast.error("Please select Cargo Category");
    if (!receiverName) return toast.error("Please enter Receiver Name");
    if (!receiverPhone) return toast.error("Please enter Receiver Phone");

    setLoading(true);

    const payload = {
      cargo_type: cargoTemp,
      unit: cargoUnit,
      qty: Number(qty),
      weight: Number(weight),
      pickup_date: pickupDate,
      cargo_category: cargoCategory,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      suburb_origin: pickupSuburb.area_code,
      suburb_destination: deliverySuburb.area_code,
      pickup_address: pickupAddress,
      delivery_address: deliveryAddress,
      customer_code: "CN00001",
      user_inp: "system",
    };

    try {
      const res = await fetch("/api/cargo-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.message || "Failed to get quote");
      else {
        toast.success("Quote successfully generated!");
        handleResetCargo();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const handleResetCargo = () => {
    setPickupSuburb(null);
    setDeliverySuburb(null);
    setPickupAddress("");
    setDeliveryAddress("");
    setCargoTemp("");
    setCargoUnit("");
    setQty("");
    setWeight("");
    setPickupDate("");
    setCargoCategory("");
    setReceiverName("");
    setReceiverPhone("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />
      <Toaster position="top-right" />
      <div className="px-6">
        <div className="p-6 px-16">
          <h1 className="text-2xl font-semibold mb-1">Create New Quote</h1>
          <p className="text-sm text-gray-500 mb-6">
            Get instant Carrier by filling this page
          </p>

          <form
            autoComplete="off"
            onSubmit={handleSubmitCargo}
            className="space-y-6"
          >
            {/* Pickup & Delivery */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-2">Pickup & Delivery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectSearch
                  label="Pickup Suburb, State"
                  value={pickupSuburb}
                  onChange={setPickupSuburb}
                />
                <TextareaField
                  label="Pickup Address"
                  rows={1}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                />
                <SelectSearch
                  label="Delivery Suburb, State"
                  value={deliverySuburb}
                  onChange={setDeliverySuburb}
                />
                <TextareaField
                  label="Delivery Address"
                  rows={1}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Cargo Details */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-2">Cargo Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SelectField
                  label="Cargo Temperature"
                  options={[
                    { label: "Frozen (-18 C to -25 C)", value: "frozen" },
                    { label: "Chilled (0 C to 5 C)", value: "chilled" },
                  ]}
                  value={cargoTemp}
                  onChange={setCargoTemp}
                  name="cargoTemp"
                  required
                />
                <SelectField
                  label="Unit"
                  options={[
                    { label: "Pallet", value: "pallet" },
                    { label: "Box", value: "box" },
                  ]}
                  value={cargoUnit}
                  onChange={setCargoUnit}
                  name="cargoUnit"
                  required
                />
                <InputField
                  label="Qty"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  name="qty"
                  required
                />
                <InputField
                  label="Weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  name="weight"
                  required
                />
                <InputField
                  label="Pickup Date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  name="pickupDate"
                  required
                />
                <SelectField
                  label="Cargo Category"
                  options={[
                    { label: "Cargo", value: "cargo" },
                    { label: "Document", value: "document" },
                  ]}
                  value={cargoCategory}
                  onChange={setCargoCategory}
                  name="cargoCategory"
                  required
                />
                <InputField
                  label="Receiver Name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  name="receiverName"
                  required
                />
                <InputField
                  label="Receiver Phone"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  name="receiverPhone"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Getting Quote..." : "Submit"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetCargo}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
