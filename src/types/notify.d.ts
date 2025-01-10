type NotifyResponse = { data: Notify[]; paginate: NotifyFilter };

type Notify = {
  id: string;
  title: string;
  message: string;
  createdDate: Date;
  createdBy: {
    id: string;
    avatar: string;
    fullName: string;
    group: {
      id: string;
      name: string;
    };
  };
  sendTo: number;
  sentTo: number;
  read: number;
  unread: number;
  toUsers?: {
    status: "read" | "unread" | "sent";
    user: { id: string; avatar: string; fullName: string; email: string };
  }[];
};

type DateRange = { fromDate?: string; toDate?: string };

type NotifyFilter = {
  receiverId?: string;
  title?: string;
} & DateRange;
