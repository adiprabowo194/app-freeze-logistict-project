"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";
import InputField from "@/components/InputField";
import SelectSearch from "@/components/SelectSearch";
import SelectField from "@/components/SelectField";
import TextareaField from "@/components/TextareaField";
import Button from "@/components/Button";

import { useRouter, useParams } from "next/navigation";
export default function QuickQuotePage() {
  const params = useParams();
  const connoteNo = params?.connoteNo as string;
  const router = useRouter();
  const [step, setStep] = useState(3);

  // ================= LOCATION =================
  const [pickupSuburb, setPickupSuburb] = useState<any>(null);
  const [deliverySuburb, setDeliverySuburb] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // ================= AUTO LOAD CUSTOMER =================
  useEffect(() => {
    if (!connoteNo) return;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/quotes/${connoteNo}`);
        const result = await res.json();

        const q = result.data;

        // 🔥 SET STATE
        setPickupSuburb({
          label: q.originArea?.suburb,
          value: q.suburb_origin,
          area_code: q.suburb_origin,
        });

        setDeliverySuburb({
          label: q.destinationArea?.suburb,
          value: q.suburb_destination,
          area_code: q.suburb_destination,
        });

        setPickupAddress(q.pickup_address || "");
        setDeliveryAddress(q.delivery_address || "");
        setPickupDate(q.pickup_date?.split("T")[0] || "");

        setReceiverName(q.receiver_name || "");
        setReceiverPhone(q.receiver_phone || "");

        const foundCarrier = carriers.find((c) => c.name === q.carrier);

        if (foundCarrier) {
          setSelectedCarrier(foundCarrier);
        } else {
          // fallback kalau tidak ketemu
          setSelectedCarrier({
            name: q.carrier,
            pickup_eta: "-",
            delivery_eta: "-",
            price: 0,
          });
        }

        // 🔥 cargos
        const mappedCargo = q.packageDetails.map((c: any) => ({
          cargoTemp: c.temperature,
          cargoUnit: c.unit,
          qty: c.qty,
          weight: c.weight,
          length: c.length,
          width: c.width,
          height: c.height,
        }));

        setCargoList(mappedCargo);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed load quote detail");
      }
    };

    loadData();
    console.log("PARAMS:", params);
    console.log("CONNOTE:", connoteNo);
  }, [connoteNo, params]);
  // ================= CARGO =================
  const [cargoList, setCargoList] = useState([
    {
      cargoTemp: "",
      cargoUnit: "",
      qty: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    },
  ]);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...cargoList];
    updated[index][field] = value;
    setCargoList(updated);
  };

  const handleAddCargo = () => {
    setCargoList([
      ...cargoList,
      {
        cargoTemp: "",
        cargoUnit: "",
        qty: "",
        weight: "",
        length: "",
        width: "",
        height: "",
      },
    ]);
  };

  const handleRemoveCargo = (index: number) => {
    setCargoList(cargoList.filter((_, i) => i !== index));
  };

  // ================= AUTO CALC =================
  const totalQty = cargoList.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0,
  );

  const totalWeight = cargoList.reduce(
    (sum, item) => sum + Number(item.weight || 0),
    0,
  );

  const totalCBM = cargoList.reduce((sum, item) => {
    const l = Number(item.length || 0);
    const w = Number(item.width || 0);
    const h = Number(item.height || 0);
    return sum + (l * w * h) / 1000000;
  }, 0);

  // ================= CARRIER =================
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);

  const carriers = [
    {
      id: 1,
      name: "DHL Express",
      pickup_eta: "1 Days",
      delivery_eta: "2 Days",
      price: 120,
    },
    {
      id: 2,
      name: "FedEx",
      pickup_eta: "1 Days",
      delivery_eta: "2 Days",
      price: 100,
    },
  ];

  // ================= RECEIVER =================
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // ================= VALIDATION =================
  const handleNext = () => {
    if (step === 1) {
      if (!pickupSuburb || !deliverySuburb) {
        return toast.error("Please complete location");
      }

      for (let cargo of cargoList) {
        if (!cargo.cargoTemp || !cargo.cargoUnit) {
          return toast.error("Temperature & Unit must fill");
        }
        if (!cargo.qty || !cargo.weight) {
          return toast.error("Qty & Weight must fill");
        }
      }
    }

    if (step === 2 && !selectedCarrier) {
      return toast.error("Please select carrier");
    }

    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // ================= Edit & update =================
  const handleEdit = async (status: "Entry" | "Booking") => {
    try {
      if (!connoteNo) {
        return toast.error("Connote number not found");
      }
      if (
        step === 3 &&
        (!pickupDate?.trim() ||
          !receiverName?.trim() ||
          !receiverPhone?.trim() ||
          !deliveryAddress?.trim())
      ) {
        return toast.error(
          "Please input Pickup Date, Receiver name & Receiver phone",
        );
      }
      const payload = {
        suburb_origin: pickupSuburb?.area_code,
        suburb_destination: deliverySuburb?.area_code,
        pickup_address: pickupAddress,
        pickup_date: pickupDate,
        delivery_address: deliveryAddress,

        receiver_name: receiverName,
        receiver_phone: receiverPhone,

        carrier: selectedCarrier?.name,
        price: selectedCarrier?.price,

        status,

        cargos: cargoList.map((c) => ({
          temperature: c.cargoTemp,
          unit: c.cargoUnit,
          qty: Number(c.qty),
          weight: Number(c.weight),
          length: Number(c.length),
          width: Number(c.width),
          height: Number(c.height),
        })),

        total_qty: totalQty,
        total_weight: totalWeight,
        total_cbm: totalCBM,
      };

      const res = await fetch(`/api/quotes/${connoteNo}`, {
        method: "PUT", // 🔥 UPDATE
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Update failed");

      toast.success("Quote updated successfully 🚀");

      // 🔥 DELAY BIAR USER LIHAT TOAST
      setTimeout(() => {
        if (status === "Booking") {
          router.push("/jobs/booking");
        } else {
          router.push("/quote/save-quote");
        }
      }, 800);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />
      <Toaster position="top-right" />

      <div className="p-6 px-16">
        <h1 className="text-2xl font-bold mb-6">Quick Quote</h1>

        {/* STEP */}
        <div className="flex gap-3 mb-6">
          {["Input", "Carrier", "Final"].map((s, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-full text-sm ${
                step === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-semibold mb-4">Pickup & Delivery</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <SelectSearch
                  label="Sending Suburb *"
                  value={pickupSuburb}
                  onChange={setPickupSuburb}
                  disabled // 🔥 default dari session
                />

                <SelectSearch
                  label="Receiver Suburb *"
                  value={deliverySuburb}
                  onChange={setDeliverySuburb}
                />
              </div>
            </div>

            {/* Cargo */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Cargo</h2>
                <button
                  onClick={handleAddCargo}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg"
                >
                  + Add List
                </button>
              </div>

              {cargoList.map((cargo, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-7 gap-4 mb-4 border p-4 rounded-xl"
                >
                  <div className="grid grid-cols-2 gap-2 md:col-span-3">
                    <SelectField
                      label="Temperature *"
                      value={cargo.cargoTemp}
                      onChange={(val) => handleChange(index, "cargoTemp", val)}
                      options={[
                        { label: "Frozen", value: "frozen" },
                        { label: "Chilled", value: "chilled" },
                      ]}
                    />
                    <SelectField
                      label="Unit *"
                      value={cargo.cargoUnit}
                      onChange={(val) => handleChange(index, "cargoUnit", val)}
                      options={[
                        { label: "Pallet", value: "pallet" },
                        { label: "Box", value: "box" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <InputField
                      label="Qty"
                      value={cargo.qty}
                      onChange={(e) =>
                        handleChange(index, "qty", e.target.value)
                      }
                    />
                    <InputField
                      label="Weight (kg)"
                      value={cargo.weight}
                      onChange={(e) =>
                        handleChange(index, "weight", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:col-span-2">
                    <InputField
                      label="Length (cm)"
                      value={cargo.length}
                      onChange={(e) =>
                        handleChange(index, "length", e.target.value)
                      }
                    />
                    <InputField
                      label="Width (cm)"
                      value={cargo.width}
                      onChange={(e) =>
                        handleChange(index, "width", e.target.value)
                      }
                    />
                    <InputField
                      label="Height (cm)"
                      value={cargo.height}
                      onChange={(e) =>
                        handleChange(index, "height", e.target.value)
                      }
                    />
                  </div>

                  {cargoList.length > 1 && (
                    <div className="md:col-span-7 text-right">
                      <button
                        onClick={() => handleRemoveCargo(index)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            {carriers.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCarrier(c)}
                className={`p-6 rounded-2xl border cursor-pointer ${
                  selectedCarrier?.id === c.id
                    ? "border-blue-500 bg-blue-50"
                    : "bg-white"
                }`}
              >
                <h3 className="font-semibold">{c.name}</h3>
                <p>Pickup: {c.pickup_eta}</p>
                <p>Delivery: {c.delivery_eta}</p>
                <p className="font-bold">${c.price}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg">Final Details</h2>

            {/* ================= LOCATION ================= */}
            <div>
              <h3 className="font-medium mb-2">Pickup & Delivery</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <SelectSearch
                  label="Sending Suburb *"
                  value={pickupSuburb}
                  onChange={setPickupSuburb}
                  disabled
                />

                <SelectSearch
                  label="Receiver Suburb *"
                  value={deliverySuburb}
                  onChange={setDeliverySuburb}
                  disabled
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <TextareaField
                  label="Pickup Address *"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />

                <TextareaField
                  label="Receiver Address *"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            </div>

            {/* ================= CARGO ================= */}
            <div>
              <h3 className="font-medium mb-2">Cargo Details</h3>

              {cargoList.map((cargo, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-7 gap-4 mb-4 border p-4 rounded-xl bg-gray-50"
                >
                  <div className="grid grid-cols-2 gap-2 md:col-span-3">
                    <InputField
                      label="Temperature *"
                      value={cargo.cargoTemp}
                      disabled
                    />
                    <InputField
                      label="Unit *"
                      value={cargo.cargoUnit}
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <InputField label="Qty*" value={cargo.qty} disabled />
                    <InputField
                      label="Weight (kg)*"
                      value={cargo.weight}
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:col-span-2">
                    <InputField
                      label="Length (cm)*"
                      value={cargo.length}
                      disabled
                    />
                    <InputField
                      label="Width (cm)*"
                      value={cargo.width}
                      disabled
                    />
                    <InputField
                      label="Height (cm)*"
                      value={cargo.height}
                      disabled
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p>
                Total Qty: <b>{totalQty}</b>
              </p>
              <p>
                Total Weight: <b>{totalWeight} kg</b>
              </p>
              <p>
                Total CBM: <b>{totalCBM.toFixed(3)} m³</b>
              </p>
            </div>

            {/* ================= CARRIER ================= */}
            <div className="bg-gray-100 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Selected Carrier</h3>
              <p className="font-medium">{selectedCarrier?.name}</p>
              <p className="text-sm">Pickup: {selectedCarrier?.pickup_eta}</p>
              <p className="text-sm">
                Delivery: {selectedCarrier?.delivery_eta}
              </p>
              <p className="text-blue-600 font-bold text-lg mt-2">
                ${selectedCarrier?.price}
              </p>
            </div>

            {/* ================= RECEIVER ================= */}
            <div>
              <h3 className="font-medium mb-2">Pickup & Receiver Info</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  type="date"
                  label="Pickup Date *"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
                <InputField
                  label="Receiver Name *"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />

                <InputField
                  label="Receiver Phone *"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <div className="mt-6">
          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex justify-between items-center">
              {/* LEFT */}
              <Button
                onClick={handleBack}
                className="px-6 py-2 rounded-lg bg-white border"
                variant="secondary"
              >
                Back
              </Button>

              {/* RIGHT */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleEdit("Entry")}
                  className="px-6 py-2 rounded-lg w-50"
                  variant="yellow"
                >
                  Edit & Save Quote
                </Button>

                <Button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-lg w-50"
                  variant="primary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex justify-between items-center">
              {/* LEFT */}
              <Button
                onClick={handleBack}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
                variant="secondary"
              >
                Back
              </Button>

              {/* RIGHT */}
              <Button
                onClick={() => handleEdit("Booking")}
                className="bg-blue-400 hover:bg-blue-500 text-black px-12 py-3 rounded-lg text-base"
              >
                Submit Quote
              </Button>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-blue-400 hover:bg-blue-500 text-black px-6 py-2 rounded-lg w-[30%]"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
