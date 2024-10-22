// ** Library Imports
import axios from "axios";

// ** Utils
import { capitalizeFirstLetter } from "./helpers";

export function handleAxiosError(error: unknown): string | string[] {
  let messages = "An unknown error occurred";

  if (axios.isCancel(error)) {
    return error.message ? capitalizeFirstLetter(error.message) : messages;
  }
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message;
  }
  return messages;
}
