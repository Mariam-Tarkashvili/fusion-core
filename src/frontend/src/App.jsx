import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366F1",
      light: "#8B8CFF",
      dark: "#4F46E5",
    },
    success: {
      main: "#10B981",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#F9FAFB",
      paper: "#ffffff",
    },
    text: {
      primary: "#1F2937",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
