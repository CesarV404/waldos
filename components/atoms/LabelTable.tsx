import { useState } from "react";
import { useLabelStore } from "@/store/label-store";
import { LabelData, LabelStoreState } from "@/interfaces/labels-inteface";
import { Table, ActionIcon, NumberInput } from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconSettings,
} from "@tabler/icons-react";

export const LabelTable = ({ items }: { items: LabelData[] }) => {
  const { removeProduct, editProductPieces } = useLabelStore<LabelStoreState>(
    (state) => state,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPieces, setEditingPieces] = useState<number>(0);

  const rows = items.map((label: LabelData) => {
    const isEditing = editingId === label.id;

    return (
      <Table.Tr key={label.id}>
        <Table.Td>{label.description}</Table.Td>
        <Table.Td>{label.barcode.code}</Table.Td>
        <Table.Td>
          {isEditing ? (
            <NumberInput
              value={editingPieces}
              onChange={(val: number | string | undefined) =>
                setEditingPieces(Number(val ?? 0))
              }
              min={0}
              step={1}
              clampBehavior="strict"
              max={9999}
              suffix="pz"
              styles={{ input: { width: 80 } }}
            />
          ) : (
            label.pieces
          )}
        </Table.Td>
        <Table.Td className="flex gap-2 flex-wrap justify-center">
          {isEditing ? (
            <>
              <ActionIcon
                variant="filled"
                color="primary.4"
                aria-label="Save row"
                onClick={() => {
                  if (editingPieces !== null) {
                    editProductPieces(label.id, editingPieces.toString());
                  }
                  setEditingId(null);
                }}
              >
                <IconCheck
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color="danger.4"
                aria-label="Cancel edit"
                onClick={() => setEditingId(null)}
              >
                <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
              </ActionIcon>
            </>
          ) : (
            <>
              <ActionIcon
                variant="filled"
                aria-label="Edit row"
                color="primary.4"
                onClick={() => {
                  setEditingId(label.id);
                  setEditingPieces(Number(label.pieces) || 0);
                }}
              >
                <IconEdit
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon
                color="danger.4"
                variant="filled"
                aria-label="Delete row"
                onClick={() => removeProduct(label.id)}
              >
                <IconTrash
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div className="overflow-x-auto rounded-md">
      <Table
        striped
        highlightOnHover
        className="bg-[var(--mantine-color-body)]"
        layout="auto"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Código</Table.Th>
            <Table.Th>Pzs</Table.Th>
            <Table.Th className="flex justify-center">
              <IconSettings stroke={1.5} />
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
