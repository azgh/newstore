import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type AdminPageArgs = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const configPromise = Promise.resolve(config);

const normalizeParams = async (paramsPromise: AdminPageArgs["params"]) => {
  const params = await paramsPromise;

  return {
    segments: params.segments ?? [],
  };
};

const normalizeSearchParams = async (
  searchParamsPromise: AdminPageArgs["searchParams"],
) => {
  const searchParams = await searchParamsPromise;

  return Object.fromEntries(
    Object.entries(searchParams).filter(([, value]) => value !== undefined),
  ) as Record<string, string | string[]>;
};

export const generateMetadata = ({ params, searchParams }: AdminPageArgs) =>
  generatePageMetadata({
    config: configPromise,
    params: normalizeParams(params),
    searchParams: normalizeSearchParams(searchParams),
  });

export default async function Page({ params, searchParams }: AdminPageArgs) {
  return RootPage({
    config: configPromise,
    importMap,
    params: normalizeParams(params),
    searchParams: normalizeSearchParams(searchParams),
  });
}
