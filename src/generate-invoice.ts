import puppeteer from "puppeteer";
import fs from "fs/promises";
import Mustache from "mustache";
import { CompletedFormValues } from "./client.model";
import company from "./assets/data/company.template.json";
import { lastInvoiceNumber } from "./assets/data/invoice-number.json";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export async function printPDF(html: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({
    format: "A4",
    margin: { bottom: 40, top: 40, left: 60, right: 60 },
  });

  await browser.close();
  return pdf;
}

function getInvoiceNumber(date: Date): string {
  const prefixInvoiceNumber = `${format(date, "yyyy-MM")}-FAC `;
  return lastInvoiceNumber?.startsWith(prefixInvoiceNumber)
    ? `${prefixInvoiceNumber}${
        Number(lastInvoiceNumber.substring(prefixInvoiceNumber.length)) + 1
      }`
    : `${prefixInvoiceNumber} 1`;
}

export async function generateInvoicePdf(
  formValues: CompletedFormValues
): Promise<string> {
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

  const invoiceData = {
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

  const template = await fs.readFile(
    __dirname + "/assets/templates/invoice-template.html"
  );
  const htmlRender = Mustache.render(template.toString(), invoiceData);
  try {
    await fs.mkdir("output");
  } catch (e) {
    // do nothing
  }

  const outputPath = `${formValues.filePath}${formValues.fileName}.pdf`;

  printPDF(htmlRender).then(async (pdf) => {
    await fs.writeFile(outputPath, pdf);
  });
  return outputPath;
}
