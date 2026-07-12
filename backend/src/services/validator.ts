import { ALLOWED_CRM_STATUS, ALLOWED_DATA_SOURCE } from "../types/crm";

export function validateRecord(record: any): any {
  const validated = { ...record };

  if (!ALLOWED_CRM_STATUS.includes(validated.crm_status)) {
    validated.crm_status = "";
  }

  if (!ALLOWED_DATA_SOURCE.includes(validated.data_source)) {
    validated.data_source = "";
  }

  if (validated.created_at) {
    const parsed = new Date(validated.created_at);
    if (isNaN(parsed.getTime())) {
      validated.created_at = "";
    }
  }

  return validated;
}