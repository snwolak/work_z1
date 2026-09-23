"use client";

import { useRef } from "react";

import {
  calcGrossPrice,
  calcNetPrice,
  parseDecimalInput,
  type ProductVatRate,
} from "@/lib/product";

export type PriceEditSide = "netPrice" | "grossPrice";

function isEmptyInput(raw: string) {
  return raw.trim() === "";
}

// Valid input derives the peer value; empty input clears the peer so no
// stale value survives; invalid non-empty input (user mid-typing) leaves
// the peer untouched.
export function deriveGrossPeer(
  rawNetPrice: string,
  vatRate: ProductVatRate,
): string | null {
  if (isEmptyInput(rawNetPrice)) {
    return "";
  }

  const netPrice = parseDecimalInput(rawNetPrice);

  return netPrice === null ? null : String(calcGrossPrice(netPrice, vatRate));
}

export function deriveNetPeer(
  rawGrossPrice: string,
  vatRate: ProductVatRate,
): string | null {
  if (isEmptyInput(rawGrossPrice)) {
    return "";
  }

  const grossPrice = parseDecimalInput(rawGrossPrice);

  return grossPrice === null ? null : String(calcNetPrice(grossPrice, vatRate));
}

export function resolveVatPeerUpdate(args: {
  netRaw: string;
  grossRaw: string;
  lastEdited: PriceEditSide;
  vatRate: ProductVatRate;
}): { name: PriceEditSide; value: string } | null {
  if (args.lastEdited === "grossPrice") {
    const value = deriveNetPeer(args.grossRaw, args.vatRate);

    return value === null ? null : { name: "netPrice", value };
  }

  const value = deriveGrossPeer(args.netRaw, args.vatRate);

  return value === null ? null : { name: "grossPrice", value };
}

export function useProductPriceSync() {
  const lastEdited = useRef<PriceEditSide>("netPrice");

  function onNetPriceChange(rawNetPrice: string, vatRate: ProductVatRate) {
    lastEdited.current = "netPrice";

    return deriveGrossPeer(rawNetPrice, vatRate);
  }

  function onGrossPriceChange(rawGrossPrice: string, vatRate: ProductVatRate) {
    lastEdited.current = "grossPrice";

    return deriveNetPeer(rawGrossPrice, vatRate);
  }

  function onVatRateChange(args: {
    netRaw: string;
    grossRaw: string;
    vatRate: ProductVatRate;
  }) {
    return resolveVatPeerUpdate({ ...args, lastEdited: lastEdited.current });
  }

  return { onNetPriceChange, onGrossPriceChange, onVatRateChange };
}
