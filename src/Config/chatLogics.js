export const isSameSenderMargin = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1]?.sender?._id === message.sender?._id &&
    message.sender?._id !== userId
  ) {
    return 33;
  } else if (
    (index < messages.length - 1 &&
      messages[index + 1]?.sender?._id !== message.sender?._id &&
      message.sender?._id !== userId) ||
    (index === messages.length - 1 && message.sender?._id !== userId)
  ) {
    return 0;
  }
  return "auto";
};

export const isSameSender = (messages, message, index, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1]?.sender?._id !== message.sender?._id ||
      messages[index + 1]?.sender?._id === undefined) &&
    message.sender?._id !== userId
  );
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1]?.sender?._id !== userId &&
    messages[messages.length - 1]?.sender?._id !== undefined
  );
};

export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1]?.sender?._id === message.sender?._id;
};

export const getSender = (loggedUser, users) => {
  if (!users?.length) return "Unknown"; // Handle empty users array
  return users[0]?._id === loggedUser?._id
    ? users[1]?.name ?? "Unknown"
    : users[0]?.name ?? "Unknown";
};

export const getSenderFull = (loggedUser, users) => {
  if (!users?.length) return null; // Handle empty users array
  return users[0]?._id === loggedUser?._id ? users[1] ?? {} : users[0] ?? {};
};
