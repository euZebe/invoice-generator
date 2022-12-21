import { Client } from "./client.model";

export type CompletedFormValues = {
  client: Client;
  workedDays: number;
  price: number;
  fileName: string;
  filePath: string;
  invoiceDate: string;
};

export type FormValues = Partial<CompletedFormValues>;
