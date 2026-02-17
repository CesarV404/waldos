import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export type FormatType = "upc_a" | "ean_13" | "code_128";

export interface StorePayloadData {
  name: string;
  id: string;
  type: string;
  iat?: number;
}

export type StorePayload = JwtPayload & {
  data: StorePayloadData;
};

export interface BarcodeData {
  code: string;
  format?: FormatType;
  img?: string | ArrayBuffer;
}

export interface LabelData {
  id: string;
  description: string;
  barcode: BarcodeData;
  madeBy: string;
  supervisedBy: string;
  pieces: string;
}

export interface LabelStoreState {
  productList: LabelData[];
  madeBy: string;
  supervisedBy: string;
  addProduct: (newProduct: LabelData) => void;
  removeProduct: (id: string) => void;
  deleteList: () => void;
  setMadeBy: (name: string) => void;
  setSupervisedBy: (name: string) => void;
  editProductPieces: (id: string, pieces: string) => void;
}

export interface DataToPrint {
  _id?: ObjectId;
  storeID: string;
  madeBy: string;
  type: "label" | "promotion";
  status: "pending" | "completed";
  isDeleted: boolean;
  labels: LabelData[];
  createdAt?: Date;
  updatedAt?: Date;
}
