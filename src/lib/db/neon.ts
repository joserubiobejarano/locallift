import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sqlInstance: NeonQueryFunction<false, false> | undefined;

export function getSql(): NeonQueryFunction<false, false> {
  if (!sqlInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "Missing DATABASE_URL. Add your Neon connection string to .env.local."
      );
    }
    sqlInstance = neon(url);
  }
  return sqlInstance;
}

/** Tagged template SQL executor (Neon serverless). */
export const sql = ((
  strings: TemplateStringsArray,
  ...values: unknown[]
) => getSql()(strings, ...values)) as NeonQueryFunction<false, false>;
