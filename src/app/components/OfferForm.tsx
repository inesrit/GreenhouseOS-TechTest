/**
 * OfferForm Component
 * Allows users to submit an offer on a property with validation and feedback
 */
"use client";

import { useState, useCallback } from "react";
import { UI_TEXT, API_ROUTES, OFFER_LIMITS } from "@/constants";
import { formatCurrency, validateOfferAmount, parseAmount } from "@/utils";
import type { OfferFormProps, OfferFormStatus, OfferSubmitResponse } from "@/types";

/**
 * Offer submission form with validation and UX feedback
 */
export default function OfferForm({
  propertyId,
  askingPrice,
  isAvailable,
  onOfferSubmitted,
}: OfferFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OfferFormStatus>("idle");
  const [touched, setTouched] = useState(false);


  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[\d,]*\.?\d*$/.test(value)) {
      setAmount(value);
      if (touched) {
        setError(validateOfferAmount(value));
      }
      if (status === "success" || status === "error") {
        setStatus("idle");
      }
    }
  }, [touched, status]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateOfferAmount(amount));
  }, [amount]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateOfferAmount(amount);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch(API_ROUTES.OFFERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          amount: parseAmount(amount),
        }),
      });

      const data: OfferSubmitResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as unknown as { error: string }).error || "Failed to submit offer");
      }

      setStatus("success");
      setAmount("");
      setTouched(false);
      onOfferSubmitted(data.offer);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : UI_TEXT.OFFER_ERROR);
    }
  }, [amount, propertyId, onOfferSubmitted]);

  if (!isAvailable) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{UI_TEXT.MAKE_AN_OFFER}</h3>
        <p className="text-gray-500">{UI_TEXT.PROPERTY_NOT_AVAILABLE}</p>
      </div>
    );
  }

  const parsedAmount = parseAmount(amount);
  const isAboveAsking = !isNaN(parsedAmount) && parsedAmount > askingPrice;
  const isBelowAsking = !isNaN(parsedAmount) && parsedAmount < askingPrice && parsedAmount >= OFFER_LIMITS.MIN_AMOUNT;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.MAKE_AN_OFFER}</h3>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label 
            htmlFor="offer-amount" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {UI_TEXT.OFFER_AMOUNT}
          </label>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              £
            </span>
            <input
              id="offer-amount"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              placeholder={UI_TEXT.OFFER_AMOUNT_PLACEHOLDER}
              disabled={status === "submitting"}
              className={`
                w-full pl-8 pr-4 py-3 text-lg border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${error && touched ? "border-red-500" : "border-gray-300"}
              `}
              aria-describedby={error ? "offer-error" : "offer-hint"}
              aria-invalid={error && touched ? "true" : "false"}
            />
          </div>

          {error && touched && (
            <p id="offer-error" className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {!error && amount && (
            <div className="mt-2">
              {isAboveAsking && (
                <p className="text-sm text-green-600">
                  ✓ {formatCurrency(parsedAmount - askingPrice)} above asking price
                </p>
              )}
              {isBelowAsking && (
                <p className="text-sm text-amber-600">
                  ⚠ {formatCurrency(askingPrice - parsedAmount)} below asking price
                </p>
              )}
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Asking price: {formatCurrency(askingPrice)}
          </p>
        </div>

        {status === "success" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg" role="alert">
            <p className="text-green-800 font-medium">✓ {UI_TEXT.OFFER_SUCCESS}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white
            transition-colors duration-200
            ${status === "submitting"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 active:bg-green-900"
            }
          `}
        >
          {status === "submitting" ? UI_TEXT.SUBMITTING_OFFER : UI_TEXT.SUBMIT_OFFER}
        </button>
      </form>
    </div>
  );
}
