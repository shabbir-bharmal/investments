interface FetchInvestmentsParams {
  IsActive?: boolean;
  Themes?: string;
  InvestmentTypes?: string;
  SpecialFilters?: string;
}

export async function fetchInvestments(
  params: FetchInvestmentsParams = {}
): Promise<any[]> {
  const {
    IsActive = true,
    Themes = "",
    InvestmentTypes = "",
    SpecialFilters = "",
  } = params;

  const queryParams = new URLSearchParams({
    IsActive: String(IsActive),
    Themes,
    InvestmentTypes,
    SpecialFilters,
  });

  const url = `/api/Public/get-investments?${queryParams.toString()}`;
  console.log("[fetchInvestments] Fetching from:", url);

  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      "[fetchInvestments] API error:",
      response.status,
      response.statusText
    );
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("[fetchInvestments] Received data:", data);

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const possibleArrayKeys = [
      "data",
      "items",
      "results",
      "investments",
      "records",
      "value",
    ];
    for (const key of possibleArrayKeys) {
      if (Array.isArray(data[key])) {
        console.log(`[fetchInvestments] Extracted array from key: "${key}"`);
        return data[key];
      }
    }
  }

  console.warn("[fetchInvestments] Unexpected response shape, returning as-is");
  return Array.isArray(data) ? data : [];
}
