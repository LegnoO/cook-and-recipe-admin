// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { notifyEndpoints } from "@/config/endpoints";

export async function queryNotify(params: string) {
  console.log("🚀 ~ queryNotify ~ params:", params);
  try {
    const response = await AxiosInstance.get<NotifyResponse>(
      notifyEndpoints.queryNotify(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getNotifyDetail(notifyId: string): Promise<Notify> {
  const response = await AxiosInstance.get(
    notifyEndpoints.getNotifyDetail(notifyId),
  );

  return response.data;
}

export async function pushNotifySpecific({
  title,
  message,
  receiver,
}: {
  title: string;
  message: string;
  receiver: string;
}) {
  const response = await AxiosInstance.post(
    notifyEndpoints.pushNotifySpecific,
    {
      title,
      message,
      receiver,
    },
  );

  return response.data;
}

export async function pushNotifyAll({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  try {
    const response = await AxiosInstance.post(notifyEndpoints.pushNotifyAll, {
      title,
      message,
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
