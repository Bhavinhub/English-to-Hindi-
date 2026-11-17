import type { KeyboardEvent } from "react";

/** Arrow-key navigation for custom role="radio" groups (moves focus and selects). */
export function onRadioGroupKeyDown(e: KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])'));
  const i = radios.indexOf(document.activeElement as HTMLElement);
  if (i < 0 || radios.length === 0) return;
  e.preventDefault();
  let n = i;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % radios.length;
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + radios.length) % radios.length;
  if (e.key === "Home") n = 0;
  if (e.key === "End") n = radios.length - 1;
  radios[n].focus();
  radios[n].click();
}
