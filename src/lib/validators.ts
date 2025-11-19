import { z } from "zod";

export const ProfileSchema = z.object({
  full_name: z.string().min(1, "Required").max(120),
  business_name: z.string().min(1, "Required").max(200),
  city: z.string().min(1, "Required").max(120),
  country: z.string().min(1, "Required").max(120),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

























