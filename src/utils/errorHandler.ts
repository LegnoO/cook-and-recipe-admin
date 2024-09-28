// ** Library Imports
import axios from "axios";
import { toast } from "react-toastify";

// ** Utils
import { capitalizeFirstLetter } from "./helpers";

export function handleAxiosError(error: unknown): void {
  if (axios.isCancel(error)) {
    const messages = error.message;
    toast.error(capitalizeFirstLetter(messages!));
  }
  if (axios.isAxiosError(error)) {
    const messages = error.response?.data?.message;
    if (Array.isArray(messages)) {
      messages.forEach((msg: string) => toast.error(msg));
    }
    if (typeof messages === "string") {
      toast.error(messages);
    }
  }
}
