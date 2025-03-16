import {
  Container,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { PlaidLink } from "./components/PlaidLink";
import { useEffect, useState } from "react";

export const Home = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = () => {
      console.log("Plaid Link script loaded!");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    const createSandboxToken = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://sandbox.plaid.com/link/token/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client_id: "", // ⚠️ TESTING ONLY
              secret: "", // ⚠️ TESTING ONLY
              user: { client_user_id: "test_user" },
              client_name: "My NetWorth",
              products: ["transactions"],
              country_codes: ["CA"],
              language: "en",
            }),
          }
        );

        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };

    createSandboxToken();
  }, []);

  console.log({ linkToken });
  const handleSuccess = (publicToken: string, metadata: any) => {
    console.log({ publicToken });
    console.log({ metadata });
  };

  return (
    <div>
      {/* AppBar - Navbar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component /*  */="div" sx={{ flexGrow: 1 }}>
            My Networth
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
          {/* Left column */}
          <Box flex={1}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Welcome to Our Website
              </Typography>
              <Typography variant="body1">
                This is the homepage of our amazing app. We're glad to have you
                here. Check out the content below.
              </Typography>
              {linkToken && (
                <PlaidLink
                  linkToken={linkToken || ""}
                  onSuccess={handleSuccess}
                />
              )}
            </Paper>
          </Box>

          {/* Right column */}
          <Box flex={2}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                Latest Updates
              </Typography>
              <Box>
                <Typography variant="body1">
                  Here are some of the latest updates and news. Stay tuned for
                  more!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last update: March 2025
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};
