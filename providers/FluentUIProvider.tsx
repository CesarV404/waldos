"use client";

// Import necessary dependencies from 'react'
import { useEffect, useRef } from "react";
// Import necessary dependencies from '@fluentui/react-components'
import {
  createDOMRenderer,
  RendererProvider,
  FluentProvider,
  webLightTheme,
  SSRProvider,
} from "@fluentui/react-components";

// Create a DOM renderer for Fluent UI.
const renderer = createDOMRenderer();

/**
 * Providers component.
 *
 * This component wraps other components with a set of providers
 * for Fluent UI, SSR, and a custom renderer.
 *
 * @param {Object} props - The properties for the Providers component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the Providers.
 * @returns {React.Element} The Providers component with child components.
 */
export const FluentUIProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Declare a state variable named 'hasMounted' and a function named 'setHasMounted' to update it.
  const hasMounted = useRef(false);

  // Use the 'useEffect' hook to set 'hasMounted' to true once the component has mounted.
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  // If the component hasn't mounted yet, return nothing.
  if (!hasMounted) {
    return null;
  }

  // If the component has mounted, return a set of providers.
  return (
    <RendererProvider renderer={renderer || createDOMRenderer()}>
      <SSRProvider>
        <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
};
