export type ErrorResponse = {
  status: number;
  message: string;
  displayMessage?: string;
  code?: string;
  fields?: unknown;
  timestamp: string;
};
