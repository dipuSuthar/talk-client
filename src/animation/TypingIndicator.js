const TypingIndicator = () => {
  const dotStyle = {
    width: "10px",
    height: "10px",
    backgroundColor: "gray",
    borderRadius: "50%",
    display: "inline-block",
    animation: "bounce 1.5s infinite",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        backgroundColor: "#B9F5D0",
        padding: "8px 12px",
        borderRadius: "15px",
        maxWidth: "100px",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        marginTop: 10,
        marginLeft: "40px",
        height: "40px",
      }}
    >
      <span style={{ ...dotStyle, animationDelay: "0s" }}></span>
      <span style={{ ...dotStyle, animationDelay: "0.2s" }}></span>
      <span style={{ ...dotStyle, animationDelay: "0.4s" }}></span>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default TypingIndicator;
