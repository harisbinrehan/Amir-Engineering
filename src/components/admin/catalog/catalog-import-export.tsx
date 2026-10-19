"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";
import { DownloadIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  exportCatalogCsv,
  validateImportRows,
  commitImportRows,
  type RowValidationResult,
  type ImportCommitResult,
} from "@/lib/actions/catalog-import";
import type { ImportRowInput } from "@/lib/validation/catalog-import-schema";

export function ExportCsvButton() {
  const [isPending, setIsPending] = useState(false);

  const handleExport = async () => {
    setIsPending(true);
    try {
      const csv = await exportCatalogCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `product-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Catalog exported");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleExport}>
      {isPending ? <Loader2Icon className="animate-spin" /> : <DownloadIcon className="size-3.5" />}
      Export CSV
    </Button>
  );
}

export function ImportCsvDialog() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [rows, setRows] = useState<ImportRowInput[]>([]);
  const [validation, setValidation] = useState<RowValidationResult[]>([]);
  const [results, setResults] = useState<ImportCommitResult[]>([]);
  const [isPending, setIsPending] = useState(false);

  const reset = () => {
    setStep("upload");
    setRows([]);
    setValidation([]);
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    Papa.parse<ImportRowInput>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setRows(results.data);
        setIsPending(true);
        try {
          const validated = await validateImportRows(results.data);
          setValidation(validated);
          setStep("preview");
        } finally {
          setIsPending(false);
        }
      },
      error: () => toast.error("Could not parse that file as CSV"),
    });
  };

  const validRows = validation.filter((v) => v.valid);
  const invalidRows = validation.filter((v) => !v.valid);

  const commit = async () => {
    if (isPending || validRows.length === 0) return;
    setIsPending(true);
    try {
      const toImport = validRows.map((v) => rows[v.index]);
      const commitResults = await commitImportRows(toImport);
      setResults(commitResults);
      setStep("done");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <UploadIcon className="size-3.5" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              One row per variant. Re-importing a file updates existing products by SKU instead of duplicating them.
              Use <span className="font-medium">Export CSV</span> first to get the exact column format.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={isPending}
              className="text-sm"
            />
            {isPending && <p className="text-muted-foreground text-sm">Validating…</p>}
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-3">
            <div className="flex gap-4 text-sm">
              <span className="text-food font-medium">{validRows.length} ready to import</span>
              {invalidRows.length > 0 && (
                <span className="text-destructive font-medium">{invalidRows.length} with errors (will be skipped)</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validation.map((v) => (
                    <TableRow key={v.index}>
                      <TableCell className="font-medium">{String(v.row.sku ?? "—")}</TableCell>
                      <TableCell className="text-muted-foreground">{String(v.row.product_name ?? "—")}</TableCell>
                      <TableCell>
                        {v.valid ? (
                          <Badge variant="secondary" className="font-normal">
                            {v.isUpdate ? "Update" : "Create"}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="font-normal">
                            Skip
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-destructive text-xs">{v.errors.join("; ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="text-food font-medium">{results.filter((r) => r.action === "created").length} created</span>
              {", "}
              <span className="font-medium">{results.filter((r) => r.action === "updated").length} updated</span>
              {", "}
              <span className="text-destructive font-medium">{results.filter((r) => r.action === "skipped").length} skipped</span>
            </p>
            <div className="max-h-80 overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => (
                    <TableRow key={`${r.sku}-${i}`}>
                      <TableCell className="font-medium">{r.sku}</TableCell>
                      <TableCell className={r.error ? "text-destructive text-xs" : "text-sm"}>
                        {r.error ?? r.action}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "preview" && (
            <>
              <Button type="button" variant="outline" onClick={reset} disabled={isPending}>
                Start Over
              </Button>
              <Button type="button" onClick={commit} disabled={isPending || validRows.length === 0}>
                {isPending && <Loader2Icon className="animate-spin" />}
                Import {validRows.length} Row{validRows.length === 1 ? "" : "s"}
              </Button>
            </>
          )}
          {step === "done" && (
            <Button type="button" onClick={() => setOpen(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
