import "./style.css";
import {
  IconButton,
  Spinner,
  useToast,
  Box,
  Text,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/Profile";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import { IoMdSend } from "react-icons/io"; // Send Icon
import { MdOutlineEmojiEmotions } from "react-icons/md";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupModel";
import { ChatState } from "../Context/ChatProvider";
import TypingIndicator from "../animation/TypingIndicator";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new_message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (senderId) => {
      if (senderId !== user._id) {
        setIsTyping(true);
      }
    });

    socket.on("stop typing", (senderId) => {
      if (senderId !== user._id) {
        setIsTyping(false);
      }
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message_recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id ||
        selectedChatCompare === null
      ) {
        console.log(selectedChatCompare, newMessageRecieved);
        if (!notification.includes(newMessageRecieved)) {
          console.log("chat set ", notification);
          setNotification([newMessageRecieved, ...notification]);
          console.log("after set");
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { chatId: selectedChat._id, senderId: user._id });
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          chatId: selectedChat._id,
          senderId: user._id,
        });
        setTyping(false);
      }
    }, timerLength);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji.emoji);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "12px",
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "90%",
              borderRadius: "8px",
              // overflow: "auto",
            }}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              style={
                {
                  // backgroundColor: "#fff",
                }
              }
            > */}
            {istyping && (
              <Box style={{ maxWidth: "100%" }}>
                <TypingIndicator />
              </Box>
            )}
            <InputGroup
              boxShadow="md"
              bg="white"
              borderRadius="10px"
              m={2}
              gap={1}
            >
              {/* Emoji Picker Button */}
              <InputLeftAddon
                bg="transparent"
                border="none"
                sx={{
                  display: { base: "none", md: "flex" },
                }}
              >
                <IconButton
                  aria-label="Open Emoji Picker"
                  icon={<MdOutlineEmojiEmotions />}
                  onClick={() => setShowPicker((prev) => !prev)} // Toggle on click
                  size="md"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: "blue.400", bg: "gray.100" }}
                />
              </InputLeftAddon>

              <Input
                variant="filled"
                bg="white"
                placeholder="Type a message..."
                value={newMessage}
                onChange={typingHandler}
                borderRadius="md"
                focusBorderColor="white"
                _hover={{ bg: "white" }}
              />
              <InputRightAddon bg="transparent" border="none">
                <IconButton
                  aria-label="Send Message"
                  icon={<IoMdSend />}
                  onClick={sendMessage}
                  onKeyDown={sendMessage}
                  size="md"
                  bg="transparent"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: "teal.400", bg: "gray.100" }}
                />
              </InputRightAddon>
            </InputGroup>
            {showPicker && (
              <Box
                ref={pickerRef}
                position="absolute"
                bottom="120px"
                left="500px"
                zIndex="1000"
                bg="white"
                borderRadius="md"
                boxShadow="lg"
              >
                <EmojiPicker
                  reactionsDefaultOpen={!showPicker}
                  onReactionClick={typingHandler}
                  onEmojiClick={handleEmojiClick}
                />
              </Box>
            )}
            {/* </FormControl> */}
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          display={selectedChat ? "none" : "flex"}
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
