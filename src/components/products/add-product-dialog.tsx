"use client";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import { ProductAvailabilityForm } from "@/components/products/product-availability-form";
import { ProductBasicInfoForm } from "@/components/products/product-basic-info-form";
import { ProductPriceForm } from "@/components/products/product-price-form";
import {
  ADD_PRODUCT_STEPS,
  useAddProductWizard,
} from "@/components/products/use-add-product-wizard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AddProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
};

export function AddProductDialog({
  open,
  onOpenChange,
  onProductAdded,
}: AddProductDialogProps) {
  const {
    step,
    formResetKey,
    isFirstStep,
    isLastStep,
    activeFormId,
    submitBasicInfo,
    submitPrice,
    submitAvailability,
    goBack,
    reset,
  } = useAddProductWizard({
    onProductAdded,
    onClose: () => onOpenChange(false),
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      onOpenChange(false);
      return;
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh max-h-dvh w-full max-w-none flex-col gap-0 overflow-hidden rounded-none bg-card p-0 text-foreground ring-0 sm:max-w-none md:h-auto md:max-h-[calc(100dvh-2rem)] md:w-[720px] md:max-w-[calc(100vw-2rem)] md:rounded-[14px] md:border md:border-black/10"
      >
        <div className="relative shrink-0 px-4 pt-6 pb-4 md:flex md:h-16 md:items-center md:border-b md:border-[#E5E5E5] md:py-0">
          <div className="flex flex-1 items-center justify-between gap-2">
            <DialogTitle className="text-base leading-none font-medium text-foreground">
              Dodaj nowy produkt
            </DialogTitle>

            <DialogClose
              aria-label="Zamknij"
              className="flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogClose>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-4 bottom-0 h-px bg-[#E5E5E5] md:hidden"
          />
        </div>

        <div className="px-4 pt-3 md:border-b md:border-[#E5E5E5] md:pb-3">
          <ol className="flex items-start gap-4 md:items-center">
            {ADD_PRODUCT_STEPS.map((wizardStep, index) => {
              const isCompleted = index < step;
              const isCurrent = index === step;

              return (
                <li
                  key={wizardStep.title}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex flex-1 md:flex-none items-start gap-4 md:items-center"
                >
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "hidden h-px w-[67px] md:block",
                        index <= step ? "bg-primary" : "bg-[#E4E4E4]",
                      )}
                    />
                  ) : null}

                  <div className="flex flex-1 flex-col items-start gap-3 md:min-w-[146px] md:flex-none md:flex-row md:items-center">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                        isCompleted || isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "border border-[#E5E5E5] bg-[#F5F5F5] text-muted-foreground",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>

                    <span className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCompleted || isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {wizardStep.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {wizardStep.description}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          <div
            aria-hidden="true"
            className="mt-3 h-px bg-[#E5E5E5] md:hidden"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:py-5">
          <div hidden={step !== 0}>
            <ProductBasicInfoForm
              key={`basic-${formResetKey}`}
              onSubmit={submitBasicInfo}
            />
          </div>

          <div hidden={step !== 1}>
            <ProductPriceForm
              key={`price-${formResetKey}`}
              onSubmit={submitPrice}
            />
          </div>

          <div hidden={step !== 2}>
            <ProductAvailabilityForm
              key={`availability-${formResetKey}`}
              onSubmit={submitAvailability}
            />
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4",
            isFirstStep ? "justify-end" : "justify-between",
          )}
        >
          {isFirstStep ? null : (
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-1.5 rounded-full px-4 text-sm font-medium"
              onClick={goBack}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Wstecz
            </Button>
          )}

          <Button
            type="submit"
            form={activeFormId}
            className="h-9 gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isLastStep ? "Zapisz produkt" : "Dalej"}
            {isLastStep ? null : (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
