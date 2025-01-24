import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../Config/chatLogics";
import GroupChatModel from "../miscellaneous/GroupChatModel";
const MyChats = () => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState(null);
  console.log(selectedChat, chats);
  // Fetch the chats
  const fetchChats = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
    if (loggedInUser?.token) {
      try {
        const headers = {
          Authorization: `Bearer ${loggedInUser.token}`,
        };

        const { data } = await axios.get("http://localhost:8000/api/chat", {
          headers,
        });
        if (data) {
          setChats(data); // Store the fetched chats in state
        }
      } catch (error) {
        console.error(error); // For debugging purposes
        toast({
          title: "Error Occurred",
          description: "Failed to load the chats.", // Provide a meaningful message
          status: "error", // Correct status
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        bg="white"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            {" "}
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        d="flex"
        flexDir={"column"}
        p={3}
        w="100%"
        bg="#F8F8F8"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overfloEwY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
