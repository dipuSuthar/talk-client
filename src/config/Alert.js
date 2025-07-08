import React, { useImperativeHandle } from "react";
import { useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";

const CustomizedSnackbars = React.forwardRef(
  ({ severity, message, autoHideDuration = 3000 }, ref) => {
    const toast = useToast();

    console.log(severity, message);
    useImperativeHandle(ref, () => ({
      handleClick() {
        const validStatuses = [
          "info",
          "warning",
          "success",
          "error",
          "loading",
        ];
        const safeSeverity = validStatuses.includes(severity)
          ? severity
          : "info";
        toast({
          title: safeSeverity === "error" ? "Error" : "Success",
          description: message,
          status: safeSeverity,
          colorScheme: safeSeverity === "error" ? "red" : "green",
          duration: autoHideDuration,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
        });
      },
    }));

    return null; // The component itself does not render anything
  }
);

CustomizedSnackbars.propTypes = {
  severity: PropTypes.oneOf(["error", "success"]).isRequired, // Prop for severity type
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired, // Prop for message content
  autoHideDuration: PropTypes.number, // Prop for toast duration
};

export default CustomizedSnackbars;
