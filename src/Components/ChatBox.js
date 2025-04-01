import { Box } from "@chakra-ui/react";
import "./style.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: {
          base: selectedChat ? "flex" : "none",
          md: selectedChat ? "flex" : "nonr",
          lg: "flex",
        },
        alignItems: "center",
        flexDirection: "column",
        p: 3,
        bg: "white",
        width: { base: "100%", md: "68%" },
        height: "100%",
        borderRadius: "lg",
        borderWidth: "1px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
