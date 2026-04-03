import { CandidateCustomer } from "./validation/customerCandidate";

export function emailTemplate(data: CandidateCustomer) {
  return `
   <div style="font-family:sans-serif">
      <h2 style="color:#3b82f6;">New Customer 🚀 from register page</h2>

      <p><strong>Company Name:</strong> ${data.companyName}</p>
      <p><strong>Contact Name:</strong> ${data.contactName}</p>
      <p><strong>Contact Number:</strong> ${data.contactNo}</p>
      <p><strong>Website:</strong> ${data.website || "-"}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Abn:</strong> ${data.abn}</p>
      <p><strong>Street Address:</strong> ${data.companyAddress}</p>
      <p><strong>Suburb:</strong> ${data.suburb}</p>
    </div>
  `;
}
