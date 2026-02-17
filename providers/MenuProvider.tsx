"use client";

import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { Burger, Menu } from "@mantine/core";

import {
  IconSettings,
  IconMessageCircle,
  IconProps,
} from "@tabler/icons-react";
import "@/app/globals.css";

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [opened, setOpened] = useState(false);

  const menuItems = [
    {
      label: "Sistema de Marbetes",
      icon: IconSettings,
      href: "/",
    },
    { label: "Sistema de Rebajas", icon: IconMessageCircle, href: "/about" },
  ];

  return (
    <div className="flex flex-col min-h-screen stars">
      <nav className="opacity-50 flex justify-between items-center p-2">
        <Menu
          trigger="hover"
          shadow="md"
          width={200}
          opened={opened}
          onChange={setOpened}
          styles={{ item: { fontSize: 16 }, dropdown: { width: "auto" } }}
        >
          <Menu.Target>
            <Burger
              size="lg"
              opened={opened}
              color="white"
              aria-label="Toggle navigation"
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Herramientas</Menu.Label>

            <Menu.Divider />
            {menuItems.map((item, index) => (
              <Menu.Item key={index} leftSection={<item.icon size={14} />}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <div className="text-2xl text-white">6176</div>
      </nav>
      <div className="grow">{children}</div>
    </div>
  );
};
