import { FormatType, LabelData } from "@/interfaces/labels-inteface";
import JsBarcode from "jsbarcode";

/**
 * Converts a Blob to a base64 Data URL (string) using FileReader.
 *
 * This helper wraps the asynchronous `FileReader` API in a Promise. On
 * success it resolves with `reader.result` which is typically a string
 * containing the data URL (e.g. "data:image/png;base64,..."). The result
 * type is `string | ArrayBuffer | null` to match the FileReader API.
 *
 * The Promise rejects if the FileReader emits an error event.
 *
 * @param blob - The `Blob` to convert to a base64 Data URL.
 * @returns A Promise that resolves with the base64 Data URL, or rejects on read error.
 */
export async function blobToBase64(
  blob: Blob,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates a PNG Blob of a barcode rendered on a canvas using JsBarcode.
 *
 * Notes:
 * - The function creates an off-screen canvas, renders the barcode into it,
 *   then converts the canvas content to a PNG Blob via `toBlob`.
 * - If `canvas.toBlob` yields `null`, the promise resolves with an empty Blob
 *   to keep the return type consistent.
 * - The `format` parameter is accepted for compatibility but the current
 *   implementation uses the `CODE128` option in JsBarcode's config. If you
 *   need to render other symbologies, update the `format` field inside the
 *   options object below.
 *
 * @param value - The barcode value to render (string).
 * @param format - Desired barcode format (currently not applied; kept for API compatibility).
 * @returns A Promise that resolves with a PNG `Blob` containing the rendered barcode image.
 */
export function generateBarcodeBlob(
  value: string,
  format: string,
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");

    JsBarcode(canvas, value, {
      format,
      width: 2,
      height: 40,
      displayValue: false,
    });

    canvas.toBlob((blob: Blob | null) => {
      const validBlob = blob ? blob : new Blob();
      resolve(validBlob);
    }, "image/png");
  });
}

/**
 * Cleans the barcode value and determines the appropriate format
 * @param barcodeValue - Raw barcode value
 * @returns Object containing cleaned barcode and format type
 */
export async function cleanAndFormatBarcode(barcodeValue: string): Promise<{
  barcodeCleaned: string;
  format: FormatType;
}> {
  const barcodeCleaned =
    String(barcodeValue)[0] === "0"
      ? String(barcodeValue).slice(1)
      : String(barcodeValue);

  const format: FormatType = barcodeCleaned.length === 12 ? "upc_a" : "ean_13";

  return { barcodeCleaned, format };
}

export const generatePDF = async (
  items: LabelData[],
  blob: Blob,
): Promise<void> => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `marb-${items[0].madeBy}-${Date.now()}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};
