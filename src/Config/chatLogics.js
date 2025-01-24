export const getSender = (loggedUser, users) => {
  return users[0].id === loggedUser._id ? users[1].name : users[0].name;
};
