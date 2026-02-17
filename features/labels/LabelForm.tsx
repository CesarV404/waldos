import { v4 as uuidv4 } from "uuid";
import { useState, ChangeEvent, useCallback } from "react";

import {
  BarcodeData,
  FormatType,
  LabelStoreState,
} from "@/interfaces/labels-inteface";
import { useLabelStore } from "@/store/label-store";

import {
  BarcodeDetector,
  ZXING_WASM_VERSION,
  prepareZXingModule,
} from "barcode-detector/ponyfill";

import {
  Button,
  Fieldset,
  FileInput,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { cleanAndFormatBarcode } from "@/utils/pdf";
import { useModalStore } from "@/store/modal-store";

prepareZXingModule({
  overrides: {
    locateFile: (path, prefix) => {
      if (path.endsWith(".wasm")) {
        return `https://unpkg.com/zxing-wasm@${ZXING_WASM_VERSION}/dist/reader/${path}`;
      }
      return prefix + path;
    },
  },
});

const barcodeDetector = new BarcodeDetector({
  formats: ["upc_a", "ean_13", "code_128"],
});

export const LabelForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [barcode, setBarcode] = useState<BarcodeData | null>(null);
  const [pieces, setPieces] = useState<string>("");

  const { open, setModalContent } = useModalStore();

  const agregarItem = () => {
    if (!description || !barcode) return;

    addProduct({
      id: uuidv4(),
      description,
      barcode,
      madeBy,
      supervisedBy,
      pieces,
    });

    setFile(null);
    setDescription("");
    setBarcode(null);
    setPieces("");
  };

  const { addProduct } = useLabelStore<LabelStoreState>(
    (state: LabelStoreState) => state,
  );

  const { madeBy, setMadeBy, supervisedBy, setSupervisedBy } =
    useLabelStore<LabelStoreState>((state: LabelStoreState) => state);

  const handlePhoto = (file: File | null) => {
    if (!file) return;
    setFile(file);

    barcodeDetector.detect(file).then(async (barcodes) => {
      if (barcodes.length === 0) {
        setModalContent(
          "Error",
          `No se encontró el código de barras.`,
          "error",
        );

        open();
        return setBarcode({ code: "" });
      }

      const barcodeValue: string | ArrayBuffer | null = barcodes[0].rawValue;
      const {
        barcodeCleaned,
        format,
      }: { barcodeCleaned: string; format: FormatType } =
        await cleanAndFormatBarcode(barcodeValue);

      setBarcode({ code: barcodeCleaned, format });
    });
  };

  return (
    <Fieldset
      style={{
        marginBottom: 20,
        borderRadius: "10px",
        display: "flex",
        flexFlow: "column nowrap",
        gap: ".5rem",
      }}
    >
      <h2 className="font-bold mb-2 text-lg">Registro de Marbete</h2>
      <TextInput
        label="Descripción"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <TextInput
          label="Código numérico"
          type="number"
          description="Manual:"
          placeholder="Código numérico"
          value={barcode !== null ? barcode.code : ""}
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            if (isNaN(Number(e.target.value))) return;
            if (e.target.value.length < 12 || e.target.value.length > 13)
              return setBarcode({ code: e.target.value });

            const {
              barcodeCleaned,
              format,
            }: { barcodeCleaned: string; format: FormatType } =
              await cleanAndFormatBarcode(e.target.value);

            setBarcode({ code: barcodeCleaned, format });
          }}
        />

        <FileInput
          value={file}
          accept="image/*"
          capture="environment"
          description="Automático:"
          placeholder="Escanear código de barras"
          onChange={handlePhoto}
        />
      </div>

      <TextInput
        label="Hecho por"
        placeholder="Hecho por"
        value={madeBy}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setMadeBy(e.target.value);
        }}
      />

      <TextInput
        label="Supervisó"
        placeholder="Supervisó"
        value={supervisedBy}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSupervisedBy(e.target.value);
        }}
      />

      <NumberInput
        label="Piezas"
        placeholder="Piezas"
        clampBehavior="strict"
        min={0}
        max={9999}
        suffix="pz"
        value={pieces}
        onChange={(value: string | number) => setPieces(String(value))}
      />

      <Button
        styles={{ root: { marginTop: "1.1rem" } }}
        onClick={agregarItem}
        color="primary.4"
      >
        Agregar
      </Button>
    </Fieldset>
  );
};
