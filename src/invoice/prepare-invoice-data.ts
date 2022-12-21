import { CompletedFormValues } from "../client.model";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import company from "../assets/data/company.json";
import { lastInvoiceNumber } from "../assets/data/invoice-number.json";

function getInvoiceNumber(date: Date): string {
  const prefixInvoiceNumber = `${format(date, "yyyy-MM")}-FAC `;
  return lastInvoiceNumber?.startsWith(prefixInvoiceNumber)
    ? `${prefixInvoiceNumber}${
        Number(lastInvoiceNumber.substring(prefixInvoiceNumber.length)) + 1
      }`
    : `${prefixInvoiceNumber} 1`;
}

export function prepareData(formValues: CompletedFormValues) {
  const date = new Date();

  const sales = [
    {
      description: [
        "Développement logiciel",
        "Jean Martineau-Figuette (JMA)",
        format(date, "MMMM yyyy", { locale: fr }),
      ],
      amount: formValues.workedDays,
      unit: "jour",
      unitaryPrice: formValues.price,
      formattedUnitaryPrice: formValues.price?.toLocaleString("fr", {
        minimumFractionDigits: 2,
      }),
      total: Number(formValues.price) * Number(formValues.workedDays),
      formattedTotal: (
        Number(formValues.price) * Number(formValues.workedDays)
      ).toLocaleString("fr", { minimumFractionDigits: 2 }),
    },
  ];
  const totalBeforeTax = sales.reduce((agg, sale) => agg + sale.total, 0);
  const vatRate = 20;
  const vatTotal = (totalBeforeTax * vatRate) / 100;
  const total = totalBeforeTax + vatTotal;

  return {
    company,
    invoiceNumber: getInvoiceNumber(date),
    invoiceDate: format(date, "dd/MM/yyyy"),
    client: formValues.client,
    sales,
    beforeTax: totalBeforeTax.toLocaleString("fr", {
      minimumFractionDigits: 2,
    }),
    vatRate: vatRate.toLocaleString("fr", { minimumFractionDigits: 2 }),
    vatTotal: vatTotal.toLocaleString("fr", { minimumFractionDigits: 2 }),
    toBePaid: total.toLocaleString("fr", { minimumFractionDigits: 2 }),
  };
}
