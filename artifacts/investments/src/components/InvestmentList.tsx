import { useState, useEffect, useCallback } from "react";
import { fetchInvestments } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function InvestmentList() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadInvestments = useCallback(async (themes: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvestments({ Themes: themes });
      setInvestments(data);
      console.log("[InvestmentList] Loaded", data.length, "investments");
    } catch (err: any) {
      console.error("[InvestmentList] Error loading investments:", err);
      setError(err.message || "Failed to load investments");
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvestments("");
  }, [loadInvestments]);


  const getName = (item: any): string =>
    item.name || item.title || item.Name || item.Title || item.investmentName || "Unnamed Investment";

  const getType = (item: any): string =>
    item.type || item.Type || item.investmentType || item.InvestmentType || item.category || "N/A";

  const getFieldsToDisplay = (item: any): { label: string; value: string }[] => {
    const skipKeys = new Set([
      "name", "title", "Name", "Title", "investmentName",
      "type", "Type", "investmentType", "InvestmentType", "category",
      "id", "Id", "ID",
    ]);
    const fields: { label: string; value: string }[] = [];
    for (const [key, value] of Object.entries(item)) {
      if (skipKeys.has(key) || value === null || value === undefined || typeof value === "object") continue;
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      fields.push({ label, value: String(value) });
      if (fields.length >= 5) break;
    }
    return fields;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Investments</h1>
          <p className="text-muted-foreground">Browse available investment opportunities</p>
          <p className="text-sm text-muted-foreground mt-1">
            Source: <span className="font-mono">{import.meta.env.VITE_BASE_URL || "Not configured"}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            API Base URL: <span className="font-mono">{import.meta.env.VITE_API_BASE_URL || "Not configured"}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Image Container: <span className="font-mono">{import.meta.env.VITE_API_IMAGE_CONTAINER || "Not configured"}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Access Token: <span className="font-mono">{import.meta.env.VITE_API_ACCESS_TOKEN ? "••••••••" : "Not configured"}</span>
          </p>
        </div>


        {loading && (
          <div className="flex items-center gap-3 justify-center py-20">
            <Spinner className="h-5 w-5" />
            <span className="text-muted-foreground">Loading investments...</span>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive font-medium mb-1">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && investments.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No investments found.</p>
          </div>
        )}

        {!loading && !error && investments.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {investments.map((item, index) => (
              <Card key={item.id || item.Id || index} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{getName(item)}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {getType(item)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1">
                  <dl className="space-y-1.5 text-sm">
                    {getFieldsToDisplay(item).map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2">
                        <dt className="text-muted-foreground shrink-0">{label}</dt>
                        <dd className="text-right truncate font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
