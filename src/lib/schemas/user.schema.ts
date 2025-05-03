import { z } from "zod";

export const userProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime({ offset: true })
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>; 