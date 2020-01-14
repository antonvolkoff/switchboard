import client from "./src/client";
import { emit } from "cluster";

export interface Email {
  envelope: { from: string, to: string[] };
  message: { data: string };
}

export async function createIncomingEmail(email: Email): Promise<boolean> {
  const response = await client.post("/api/mails", email);
  return (response.status == 200);
}

export async function mockCreateIncomingEmail(email: Email): Promise<boolean> {
  return true;
}
