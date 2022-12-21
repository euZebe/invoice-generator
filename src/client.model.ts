export type Client = {
  name: string;
  address: string[];
  contractRef?: string;
};

export type FormValues = Partial<CompletedFormValues>;

export type CompletedFormValues = {
  client: Client;
  workedDays: number;
  price: number;
  fileName: string;
  filePath: string;
};
