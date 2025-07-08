import React, { useState, useRef } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomizedSnackbars from "../../config/Alert";
import { GetAuthorizedApi } from "../../config/GenericApi";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const muiRef = useRef(null);
  const [alert, setAlert] = React.useState({
    severity: "",
    message: "",
  });
  const HandleLogin = async () => {
    try {
      const data = {
        email: Email,
        password: password,
      };

      const path = `${process.env.REACT_APP_API_ENDPOINT}/api/user/login`;
      // const response = await axios.post(path, data, { headers });
      const response = await GetAuthorizedApi(path, data);
      console.log("response.data:", response); // Should show your user object
      console.log("Token:", response.token);
      if (response) {
        setAlert({
          ...alert,
          severity: "success",
          message: "Login Successfully",
        });
        muiRef.current.handleClick();
        sessionStorage.setItem("userInfo", JSON.stringify(response));
        sessionStorage.setItem("key", response.token);
        window.location.href = "/chats";
      }
    } catch (error) {
      console.log(error.message);
      setAlert({
        ...alert,
        severity: "error",
        message: error.message,
      });
      muiRef.current.handleClick();
      // Handle errors here
      console.error("There was an error with the login request", error);
    }
  };
  return (
    <>
      <CustomizedSnackbars
        ref={muiRef}
        severity={alert.severity} // 'success' or 'error'
        message={alert.message}
      />
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={!showPassword ? "password" : "text"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value.trim())}
          />
          <InputRightElement>
            {showPassword ? (
              <IconButton onClick={() => setshowPassword(!showPassword)}>
                <ViewOffIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setshowPassword(!showPassword)}>
                <ViewIcon />
              </IconButton>
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        m={2}
        width="100%"
        isLoading={false}
        loadingText="Submitting"
        backgroundColor="#bee3f8"
        variant="solid"
        onClick={HandleLogin}
      >
        Submit
      </Button>
      <Button
        m={2}
        width="100%"
        isLoading={false}
        loadingText="Submitting"
        backgroundColor="red"
        variant="solid"
      >
        Get Guest User Credentials
      </Button>
    </>
  );
};

export default Login;
