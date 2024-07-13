import { z } from "zod";
export const MakeNewEscrowSchema = z.object({
  mint_a: z.string(),
  mint_b: z.string(),
  deposit: z.coerce.number().positive(),
  receive: z.coerce.number().positive(),
});

export type MakeNewEscrowSchemaType = z.infer<typeof MakeNewEscrowSchema>;
