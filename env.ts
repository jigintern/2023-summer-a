import "https://deno.land/std@0.192.0/dotenv/load.ts";

// SQLの設定
export const connectionParam = {
  hostname: Deno.env.get("HOST_NAME"),
  username: Deno.env.get("SQL_USER"),
  password: Deno.env.get("SQL_PASSWORD"),
  db: Deno.env.get("DATABASE"),
  port: Number(Deno.env.get("PORT")),
};