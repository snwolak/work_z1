"use client";

import { useState } from "react";

import { PRODUCT_AVAILABILITY_FORM_ID } from "@/components/products/product-availability-form";
import { PRODUCT_BASIC_INFO_FORM_ID } from "@/components/products/product-basic-info-form";
import { PRODUCT_PRICE_FORM_ID } from "@/components/products/product-price-form";
import { toast } from "@/components/ui/toast";
import {
  productSchema,
  type ProductAvailability,
  type ProductBasicInfo,
  type ProductPrice,
} from "@/lib/product";
import { useProductStore } from "@/store/product-store";

export const ADD_PRODUCT_STEPS = [
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

function createProductId(): string {
  return `prd_${crypto.randomUUID()}`;
}

type UseAddProductWizardArgs = {
  onProductAdded?: (() => void) | undefined;
  onClose: () => void;
};

export function useAddProductWizard({
  onProductAdded,
  onClose,
}: UseAddProductWizardArgs) {
  const addProduct = useProductStore((state) => state.addProduct);
  const [step, setStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<ProductBasicInfo | null>(null);
  const [price, setPrice] = useState<ProductPrice | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const isFirstStep = step === 0;
  const isLastStep = step === ADD_PRODUCT_STEPS.length - 1;
  const activeFormId =
    ADD_PRODUCT_STEPS[step]?.formId ?? PRODUCT_BASIC_INFO_FORM_ID;

  function reset(): void {
    setStep(0);
    setBasicInfo(null);
    setPrice(null);
    setFormResetKey((key) => key + 1);
  }

  function close(): void {
    reset();
    onClose();
  }

  function submitBasicInfo(value: ProductBasicInfo): void {
    setBasicInfo(value);
    setStep(1);
  }

  function submitPrice(value: ProductPrice): void {
    setPrice(value);
    setStep(2);
  }

  function goBack(): void {
    setStep((current) => Math.max(0, current - 1));
  }

  function submitAvailability(availability: ProductAvailability): void {
    if (!basicInfo) {
      setStep(0);
      return;
    }

    if (!price) {
      setStep(1);
      return;
    }

    const parsed = productSchema.safeParse({
      id: createProductId(),
      ...basicInfo,
      ...price,
      ...availability,
    });

    if (!parsed.success) {
      return;
    }

    addProduct(parsed.data);
    toast.add({ type: "success", title: "Produkt został dodany" });
    onProductAdded?.();
    close();
  }

  return {
    step,
    basicInfo,
    price,
    formResetKey,
    isFirstStep,
    isLastStep,
    activeFormId,
    submitBasicInfo,
    submitPrice,
    submitAvailability,
    goBack,
    reset,
    close,
  };
}
