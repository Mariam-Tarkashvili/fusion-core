import { observer } from "mobx-react";
import { Container, Box } from "@mui/material";
import ChatAssistant from "./components/ChatAssistant";

const Index = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth={false} disableGutters sx={{ py: 0 }}>
        <Box sx={{ py: 2 }}>
          <ChatAssistant />
        </Box>
      </Container>
    </Box>
  );
};

export default observer(Index);
