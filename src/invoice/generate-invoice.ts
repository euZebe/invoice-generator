import puppeteer from "puppeteer";
import fs from "fs/promises";
import Mustache from "mustache";
import { prepareData } from "./prepare-invoice-data";
import { CompletedFormValues } from "../form-values.model";

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

export async function generateInvoicePdf(
  formValues: CompletedFormValues
): Promise<string> {
  const invoiceData = prepareData(formValues);

  const template = await fs.readFile(
    __dirname + "/../assets/templates/invoice-template.html"
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
