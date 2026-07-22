/**
 * Enquiry categories shared by the contact API and both enquiry forms.
 * The value is used as the email subject prefix, e.g.
 * "[Real Estate & Construction] Wamey Villa".
 */
export const ENQUIRY_TYPES = [
  "Architectural & Structural Design",
  "3D Design",
  "Real Estate & Construction",
  "General Enquiry",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const DEFAULT_ENQUIRY_TYPE: EnquiryType = "General Enquiry";

export function isEnquiryType(value: unknown): value is EnquiryType {
  return (
    typeof value === "string" &&
    (ENQUIRY_TYPES as readonly string[]).includes(value)
  );
}
