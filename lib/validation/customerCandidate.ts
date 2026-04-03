import { z } from "zod";

export const customerSchema = z.object({
  companyName: z.string().min(3),
  abn: z.string().min(3),
  email: z.string().email(),
  website: z.string().optional(),
  contactName: z.string().min(3),
  contactNo: z.string().min(6).max(20),
  suburb: z.string().min(2),
  companyAddress: z.string().min(5),
  inputType: z.number().int().positive(),
});
export type CandidateCustomer = z.infer<typeof customerSchema>;
