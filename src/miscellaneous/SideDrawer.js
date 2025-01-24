import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuDivider,
  MenuItem,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./Profile";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../Components/ChatLoading";
import UserListItem from "../Components/UserAvatar/UserListItem";

const SideDrawer = () => {
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  console.log(user.token);
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handlesearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning", // Correct status
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return; // Exit early if no search input
    }

    try {
      setLoading(true);

      const path = `http://localhost:8000/api/user?search=${search}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

      const response = await axios.get(path, { headers });
      console.log(response);
      setsearchResult(response.data);
      setLoading(false); // Reset loading state
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the search results.", // Provide a meaningful message
        status: "error", // Correct status
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false); // Reset loading state even on error
    }
  };

  const accessChat = async (userId) => {
    try {
      // setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/chat",
        { userId },
        { headers }
      );
      console.log(data);
      if (data) {
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        // setLoading(false);
        onClose();
      }
    } catch (error) {}
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search Users To Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text d={{ base: "none", md: "flex" }} px={"4"}>
              {" "}
              search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily="Work-sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
              {/* <Avatar
                size={"sm"}
                name={user && user.name}
                src={user && user.pic}
              /> */}
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search by name or email.."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handlesearch}>Go Search </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
