export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPKR(amount: number) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

export function normalizeCustomerId(input: string) {
  return input.trim().toUpperCase();
}

export function isValidCustomerId(id: string) {
  return /^AFF\d{3,}$/.test(id);
}
