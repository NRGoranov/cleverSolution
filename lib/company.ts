/**
 * Identity required on the site by the Commerce Act (art. 13) and the
 * E-Commerce Act (art. 4). Seat, UIC and VAT number are the Commercial
 * Register entry for ЕИК 208662488. The bank account is not in that
 * register — set NEXT_PUBLIC_BANK_ACCOUNT when the IBAN is confirmed.
 */
export const company = {
  legalName: "КЛЕВЪР СОЛЮШЪН ЕООД",
  uic: "208662488",
  vatId: "BG208662488",
  register: "Търговски регистър при Агенция по вписванията",
  seat: "гр. София 1517, р-н Подуяне, ж.к. Сухата река, бл. 44А, вх. Б, ап. 19",
  email: "office@cleversolution.bg",
  phone: "+359 888 250 818",
  bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT?.trim() ?? "",
} as const;
