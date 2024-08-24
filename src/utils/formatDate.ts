import dayjs from "dayjs";

export const formatDate = (isoString: string): string => {
  const now = dayjs();
  const messageTime = dayjs(isoString);
  const hoursDiff = now.diff(messageTime, "hour");

  if (hoursDiff < 24) return messageTime.format("HH:mm");
  return messageTime.format("DD/MM");
};
