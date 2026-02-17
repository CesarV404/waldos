"use client";

import { use, useState } from "react";
import { useLabelStore } from "@/store/label-store";

import { LabelTable } from "@/components/atoms/LabelTable";
import { Button, Card } from "@mantine/core";
import {
  DataToPrint,
  LabelData,
  LabelStoreState,
} from "@/interfaces/labels-inteface";
import { LabelForm } from "@/features/labels/LabelForm";
import axios from "axios";
import { useModalStore } from "@/store/modal-store";

export default function Labels({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { open, setModalContent } = useModalStore();
  const { id } = use<{ id: string }>(params);

  const [isSendingToPrintLoading, setIsSendingToPrintLoading] =
    useState<boolean>(false);

  const productList = useLabelStore<LabelData[]>((state) => state.productList);
  const madeBy = useLabelStore<string>((state) => state.madeBy);
  const { deleteList } = useLabelStore<LabelStoreState>(
    (state: LabelStoreState) => state,
  );

  const sendDataToPrint = async (data: DataToPrint) => {
    try {
      const response = await axios.post("/api/data", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data);
        throw error.response?.data;
      }
      throw error;
    }
  };

  const handlePrint = async () => {
    try {
      setIsSendingToPrintLoading(true);
      await sendDataToPrint({
        storeID: id,
        madeBy,
        type: "label",
        status: "pending",
        isDeleted: false,
        labels: productList,
      });

      setModalContent(
        "Éxito",
        `Se han enviado los marbetes a la lista de impresiones`,
        "success",
      );
    } catch (error) {
      setModalContent(
        "Error",
        `Sucedió un error al enviar los marbetes, contacte al administrador`,
        "error",
      );
    } finally {
      setIsSendingToPrintLoading(false);
      open();
    }
  };

  return (
    <div className="sm:flex sm:justify-center">
      <div
        className="sm:w-[70%] lg:w-[45%]"
        style={{ padding: 20, fontFamily: "Arial" }}
      >
        {/* FORMULARIO */}
        <LabelForm />

        {/* LISTA */}
        {productList.length > 0 ? (
          <>
            <Card style={{ marginBottom: 20 }}>
              <div className="flex  justify-between items-center">
                <div className="flex gap-2 mr-2">
                  <Button color="danger.4" onClick={deleteList}>
                    Borrar lista
                  </Button>
                  <Button
                    color="primary.4"
                    onClick={handlePrint}
                    loaderProps={{ type: "dots" }}
                    loading={isSendingToPrintLoading}
                    disabled={isSendingToPrintLoading}
                  >
                    Imprimir
                  </Button>
                </div>
              </div>
            </Card>
            <h3
              style={{
                fontWeight: "bold",
                color: "var(--mantine-color-primary-7)",
              }}
            >
              Lista - Marbetes: {productList.length}
            </h3>
            <LabelTable items={productList} />
          </>
        ) : (
          <p>No hay registros</p>
        )}
      </div>
    </div>
  );
}
