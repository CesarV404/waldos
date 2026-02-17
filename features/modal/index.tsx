"use client";

import { Button, Modal } from "@mantine/core";
import { useModalStore } from "@/store/modal-store";
import { useEffect } from "react";

const bgColors: Record<string, { color: string; position: number }> = {
  info: {
    color: "primary",
    position: 4,
  },
  success: {
    color: "success",
    position: 4,
  },
  error: {
    color: "danger",
    position: 4,
  },
  warning: {
    color: "warning",
    position: 7,
  },
};

export const ModalFeature = () => {
  const title = useModalStore((state) => state.title);
  const msg = useModalStore((state) => state.msg);
  const type = useModalStore((state) => state.type);

  const { isModalOpen, close } = useModalStore((state) => state);

  useEffect(() => {
    console.log("Modal type changed:", type);
  }, [type]);

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: `var(--mantine-color-${bgColors[type].color}-${bgColors[type].position})`,
        },
        content: {
          backgroundColor: `var(--mantine-color-${bgColors[type].color}-${bgColors[type].position})`,
        },
      }}
      opened={isModalOpen}
      onClose={close}
      title={title}
      size="auto"
      centered
    >
      <p className="mb-4">{msg}</p>
      <Button color="primary.4" onClick={close}>
        Cerrar
      </Button>
    </Modal>
  );
};
