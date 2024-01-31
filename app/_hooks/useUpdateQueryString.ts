import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback } from "react";

function useUpdateQueryString(
  queryParamKey: string,
  searchParams: ReadonlyURLSearchParams
) {
  const updateQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(queryParamKey, value);
      return params.toString();
    },
    [searchParams, queryParamKey]
  );
  return updateQueryString;
}

export default useUpdateQueryString;
