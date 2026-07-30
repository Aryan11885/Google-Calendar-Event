"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  loading?: boolean;
  title?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteDialog({
  open,
  loading = false,
  title = "this event",
  onOpenChange,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

        <Dialog.Content
          onPointerDownOutside={(e) => { if (loading) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (loading) e.preventDefault(); }}
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">
              Delete Event
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-red-500/15 p-2.5">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white">
                Are you sure you want to delete this event?
              </p>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                <span className="font-medium text-slate-200">{title}</span>
                {" "}will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Cancel
              </button>
            </Dialog.Close>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete event
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}