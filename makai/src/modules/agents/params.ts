import { DEFAULT_PAGE } from "@/constants";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParamsFilters = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(searchParamsFilters);
