import { z } from "zod";

export const enquirySchema = z.object({
  enquiry: z.string().min(3),
});
export type sendEnquiry = z.infer<typeof enquirySchema>;
