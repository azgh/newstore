import type { ReactNode } from "react";

import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";

import "./payload.css";

import { importMap } from "./admin/importMap";

const configPromise = Promise.resolve(config);

export default async function PayloadLayout({
  children,
}: {
  children: ReactNode;
}) {
  async function serverFunction({
    args,
    name,
  }: {
    args: Record<string, unknown>;
    name: string;
  }) {
    "use server";

    return handleServerFunctions({
      args,
      config: configPromise,
      importMap,
      name,
    });
  }

  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
