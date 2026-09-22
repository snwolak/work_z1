"use client";

import { Fragment, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import {
  PRODUCT_BASIC_INFO_FORM_ID,
  ProductBasicInfoForm,
} from "@/components/products/product-basic-info-form";
import {
  PRODUCT_AVAILABILITY_FORM_ID,
  ProductAvailabilityForm,
} from "@/components/products/product-availability-form";
import {
  PRODUCT_PRICE_FORM_ID,
  ProductPriceForm,
} from "@/components/products/product-price-form";
import { Button } from "@/components/ui/button";
import type {
  Product,
  ProductAvailability,
  ProductBasicInfo,
  ProductPrice,
} from "@/lib/product";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/product-store";

const STEPS = [
  {
    title: "Informacje",
    description: "Dane podstawowe",
    formId: PRODUCT_BASIC_INFO_FORM_ID,
  },
  {
    title: "Cena",
    description: "Dane cenowe",
    formId: PRODUCT_PRICE_FORM_ID,
  },
  {
    title: "Dostępność",
    description: "Stany magazynowe",
    formId: PRODUCT_AVAILABILITY_FORM_ID,
  },
] as const;

type AddProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
};

function createProductId() {
  return `prd_${crypto.randomUUID()}`;
}

export function AddProductDialog({
  open,
  onOpenChange,
  onProductAdded,
}: AddProductDialogProps) {
  const addProduct = useProductStore((state) => state.addProduct);
  const [step, setStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<ProductBasicInfo | null>(null);
  const [price, setPrice] = useState<ProductPrice | null>(null);
  const isFirstStep = step === 0;
  const isLastStep = step === STEPS.length - 1;
  const formId = STEPS[step]?.formId ?? null;

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setStep(0);
      setBasicInfo(null);
      setPrice(null);
    }
  }

  function handleAvailabilitySubmit(availability: ProductAvailability) {
    if (!basicInfo || !price) {
      return;
    }

    const product: Product = {
      id: createProductId(),
      ...basicInfo,
      ...price,
      ...availability,
    };

    addProduct(product);
    onProductAdded?.();
    handleOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />

        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-card md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[calc(100dvh-2rem)] md:w-[720px] md:max-w-[calc(100vw-2rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[14px] md:border md:border-black/10">
          <div className="px-4 pt-6 md:border-b md:border-[#E5E5E5] md:pb-6">
            <div className="flex items-center justify-between gap-2">
              <Dialog.Title className="text-base leading-none font-medium text-foreground">
                Dodaj nowy produkt
              </Dialog.Title>

              <Dialog.Close
                aria-label="Zamknij"
                className="flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-4" aria-hidden="true" />
              </Dialog.Close>
            </div>

            <div
              aria-hidden="true"
              className="mt-4 h-px bg-[#E5E5E5] md:hidden"
            />
          </div>

          <div className="px-4 pt-3 md:border-b md:border-[#E5E5E5] md:pb-3">
            <div className="flex items-start gap-4 md:items-center">
              {STEPS.map((item, index) => {
                const isCompleted = index < step;
                const isCurrent = index === step;

                return (
                  <Fragment key={item.title}>
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
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            <div
              aria-hidden="true"
              className="mt-3 h-px bg-[#E5E5E5] md:hidden"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className={cn(step !== 0 && "hidden")}>
              <ProductBasicInfoForm
                onSubmit={(value) => {
                  setBasicInfo(value);
                  setStep(1);
                }}
              />
            </div>

            <div className={cn(step !== 1 && "hidden")}>
              <ProductPriceForm
                onSubmit={(value) => {
                  setPrice(value);
                  setStep(2);
                }}
              />
            </div>

            <div className={cn(step !== 2 && "hidden")}>
              <ProductAvailabilityForm onSubmit={handleAvailabilitySubmit} />
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
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Wstecz
              </Button>
            )}

            <Button
              type={formId ? "submit" : "button"}
              form={formId ?? undefined}
              className="h-9 gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (!formId && !isLastStep) {
                  setStep(step + 1);
                }
              }}
            >
              {isLastStep ? "Zapisz produkt" : "Dalej"}
              {isLastStep ? null : (
                <ArrowRight className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
