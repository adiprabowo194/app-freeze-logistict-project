"use client";

import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextareaField from "@/components/TextareaField";
import Button from "@/components/Button";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Page() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* LEFT BANNER */}
      <div
        className="w-[52%] relative bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/warehouse.webp')" }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(66,103,215,0.2) 0%, rgba(66,103,215,0.8) 61%, rgba(66,103,215,1) 95%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white left-14">
          <Logo size="sm" textColor="text-white" color="text-white" />

          <h1 className="text-6xl font-bold leading-tight mb-6">
            Why Freeze <br /> Logistics?
          </h1>

          <p className="text-base opacity-90 w-full mb-10">
            Experience premium chilled and frozen product distribution{" "}
            <div>with the highest quality standards.</div>
          </p>

          <Link
            href="https://www.freezelogistics.au"
            target="_blank"
            className="text-xl opacity-80 hover:underline"
          >
            www.freezelogistics.au
          </Link>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-[48%] bg-[#F4F6FA] h-full overflow-y-auto flex justify-center">
        <div className="w-full max-w-xl py-12 px-8">
          {/* Back */}
          <Link
            href="/login"
            className="text-sm font-bold text-gray-500 hover:underline"
          >
            <i className="ri-arrow-left-s-fill"></i> back to login
          </Link>

          {/* Title */}
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Register Customer
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              pleas fill above input form your biodata company
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-3">
            <InputField
              label="Company Name"
              name="companyName"
              placeholder="PT. Corp Company"
              className="rounded-full text-sm"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Email"
                name="email"
                placeholder="youremail@gmail.com"
                className="rounded-full text-sm"
              />

              <InputField
                label="Website"
                name="website"
                placeholder="www.corp-company.com"
                className="rounded-full text-sm"
              />

              <InputField
                label="Contact Name"
                name="contactName"
                placeholder="Your Name"
                className="rounded-full text-sm"
              />

              <InputField
                label="Contact No."
                name="contactNo"
                placeholder="+21 800 xxxx"
                className="rounded-full text-sm"
              />

              <SelectField
                label="State"
                name="state"
                placeholder="Northern Territory"
                className="rounded-full text-sm"
                options={[
                  { label: "Northern Territory", value: "nt" },
                  { label: "Victoria", value: "vic" },
                ]}
              />

              <SelectField
                label="Suburb"
                name="suburb"
                placeholder="Darwin City"
                className="rounded-full text-sm"
                options={[
                  { label: "Darwin City", value: "darwin" },
                  { label: "Sydney", value: "sydney" },
                ]}
              />
            </div>

            <TextareaField
              label="Company Address"
              name="companyAddress"
              rows={2}
              placeholder="Full Street Address"
              className="rounded-2xl text-sm"
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full rounded-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
