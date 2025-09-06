import { z } from "zod";

export const verifySchema = z.object({
  country: z.enum(["IN", "AU", "UK"]),
  documentType: z.enum(["aadhaar", "passport"])
});
