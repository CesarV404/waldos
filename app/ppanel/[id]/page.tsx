"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Stack,
  Group,
  Text,
  Paper,
  ActionIcon,
  FileButton,
} from "@mantine/core";
import * as XLSX from "xlsx";
import {
  IconRefresh,
  IconPrinter,
  IconSettings,
  IconFileTypePdf,
  IconFileDescription,
  IconFileUpload,
} from "@tabler/icons-react";
import axios from "axios";
import "@/app/globals.css";
import { DataToPrint, LabelData } from "@/interfaces/labels-inteface";
import { MyDocument } from "@/pdf-templates/labels-template";
import { pdf } from "@react-pdf/renderer";
import { useModalStore } from "@/store/modal-store";

import {
  cleanAndFormatBarcode,
  generateBarcodeBlob,
  blobToBase64,
} from "@/utils/pdf";

export default function PPanel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [jobs, setJobs] = useState<DataToPrint[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const { open, setModalContent } = useModalStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: { data: DataToPrint[] } = await axios.get("/api/data");
      console.log("Raw data from API:", response);
      const orderedData: DataToPrint[] = response.data.sort(
        (a: DataToPrint, b: DataToPrint) => {
          const dateA = new Date(a.createdAt || "");
          const dateB = new Date(b.createdAt || "");
          return dateA.getTime() - dateB.getTime();
        },
      );

      setJobs(orderedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setModalContent("Error", `No se pudieron cargar los datos`, "error");
      open();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates a barcode image and converts it to base64
   * @param barcodeValue - Raw barcode value
   * @returns Object containing cleaned barcode and base64 encoded image
   */
  async function generateBarcode(barcodeValue: string): Promise<{
    barcodeCleaned: string;
    base64Barcode: string | ArrayBuffer | null;
  }> {
    const { barcodeCleaned, format } =
      await cleanAndFormatBarcode(barcodeValue);

    const barcodeImgBlob: Blob = await generateBarcodeBlob(
      String(barcodeCleaned),
      format,
    );

    const base64Barcode: string | ArrayBuffer | null =
      await blobToBase64(barcodeImgBlob);

    return { barcodeCleaned, base64Barcode };
  }

  const getFormattedDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}_${hours}-${minutes}`;
  };

  const generateFileName = (job: DataToPrint): string => {
    const type = job.type === "label" ? "etiqueta" : "promocion";
    const timestamp = getFormattedDate(
      new Date(job.createdAt !== undefined ? job.createdAt : new Date()),
    );
    return `${job.storeID}-${type}-${job.madeBy}-${timestamp}.pdf`;
  };

  const handleExcelUpload = async (payload: File | null) => {
    if (!payload) return;

    try {
      setIsExcelUploading(true);
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(buffer);
          const workbook = XLSX.read(uint8Array, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          console.log(data);

          await axios.post("/api/data", { items: data });
          setModalContent(
            "Éxito",
            "Archivo Excel cargado correctamente",
            "success",
          );
          open();
          fetchData();
        } catch (error) {
          console.error("Error processing Excel:", error);
          setModalContent(
            "Error",
            "Error al procesar el archivo Excel",
            "error",
          );
          open();
        } finally {
          setIsExcelUploading(false);
        }
      };

      reader.readAsArrayBuffer(payload);
    } catch (error) {
      console.error("Error uploading file:", error);
      setModalContent("Error", "Error al cargar el archivo", "error");
      open();
      setIsExcelUploading(false);
    }
  };

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700} className="!text-gray-500">
          Cola de Impresiones
        </Text>
        <div className="flex gap-2">
          <Button
            color="primary.4"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchData}
            loading={loading}
          >
            Actualizar
          </Button>
          <FileButton onChange={handleExcelUpload} accept=".xlsx,.xls,.csv">
            {(props) => (
              <Button
                color="success.6"
                loading={isExcelUploading}
                leftSection={<IconFileUpload size={16} />}
                {...props}
              >
                Subir Excel
              </Button>
            )}
          </FileButton>
        </div>
      </Group>

      <Paper
        styles={{
          root: {
            cursor: "default",
          },
        }}
        shadow="sm"
        radius="md"
        withBorder
      >
        <div className="special-bg p-4">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Documento</Table.Th>
                <Table.Th className="flex justify-center">
                  <IconSettings stroke={1.5} />
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {jobs.map((job: DataToPrint) => {
                const fileName = generateFileName(job);
                console.log(job);
                return (
                  <Table.Tr
                    key={job._id?.toString()}
                    data-tooltip="Descripción personalizada"
                  >
                    <Table.Td>
                      <Group gap="xs">
                        <IconFileDescription size={18} />
                        <Text size="sm">{fileName}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td className="flex justify-center gap-2">
                      <ActionIcon
                        variant="filled"
                        aria-label="Edit row"
                        color="primary.4"
                        onClick={() => {}}
                      >
                        <IconPrinter
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                      <ActionIcon
                        color="danger.4"
                        variant="filled"
                        aria-label="Delete row"
                        onClick={() => {}}
                      >
                        <IconFileTypePdf
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    </Stack>
  );
}
