import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Avatar,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultAvatar = "https://via.placeholder.com/150"; // Dummy profile avatar

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          float="right"
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
        />
      )}

      <Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="lg" overflow="hidden">
          <ModalHeader
            fontSize="28px"
            fontWeight="bold"
            fontFamily="Work sans"
            textAlign="center"
            py={3}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={5}
          >
            {/* <Image
              borderRadius="full"
              boxSize="120px"
              src={user.pic || defaultAvatar}
              alt={user.name}
              border="2px solid gray"
            /> */}
            <Avatar
              name={user.name}
              src={user.pic || defaultAvatar}
              size="2xl"
            />
            <Text
              fontSize="18px"
              fontWeight="medium"
              mt={4}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              style={{
                backgroundColor: "#38b2ac",
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
