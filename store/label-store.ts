import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LabelData, LabelStoreState } from "@/interfaces/labels-inteface";

/**
 * Zustand hook to manage the global state of product labels.
 * Automatically persists data to localStorage.
 */
export const useLabelStore = create<LabelStoreState>()(
  persist(
    (set) => ({
      // Initial state
      productList: [], // List of products/labels
      madeBy: "", // Name of who made the product
      supervisedBy: "", // Name of who supervised the product

      /**
       * Adds a new product to the list
       * @param newProduct - The new product to add
       */
      addProduct: (newProduct: LabelData) =>
        set((state: { productList: LabelData[] }) => ({
          productList: [...state.productList, newProduct],
        })),

      /**
       * Removes a product from the list by its ID
       * @param id - ID of the product to remove
       */
      removeProduct: (id: string) =>
        set((state: { productList: LabelData[] }) => {
          const removedItem = state.productList.filter(
            (item: LabelData) => item.id !== id,
          );
          return { productList: removedItem };
        }),

      /**
       * Deletes all products from the list
       */
      deleteList: () => set({ productList: [] }),

      /**
       * Updates the 'madeBy' field (who made the product)
       * @param name - Name of the person
       */
      setMadeBy: (name: string) => set({ madeBy: name }),

      /**
       * Updates the 'supervisedBy' field (who supervised the product)
       * @param name - Name of the person
       */
      setSupervisedBy: (name: string) => set({ supervisedBy: name }),

      /**
       * Edits the number of pieces for a specific product
       * @param id - ID of the product to edit
       * @param pieces - New number of pieces
       */
      editProductPieces: (id: string, pieces: string) =>
        set((state: { productList: LabelData[] }) => ({
          productList: state.productList.map((item: LabelData) =>
            item.id === id ? { ...item, pieces } : item,
          ),
        })),
    }),
    {
      // localStorage persistence configuration
      name: "product-list-storage", // Unique key for storing in localStorage
    },
  ),
);
