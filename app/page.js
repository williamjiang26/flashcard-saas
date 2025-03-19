"use client";
import {
  Typography,
  Box,
  Button,
  Grid,
  Container,
  Card,
  MenuItem,
} from "@mui/material";
import getStripe from "./utils/get-stripe";
import Topbar from "./topbar/page";
import { useUser } from "@clerk/nextjs";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save"



const handleSubmit = async () => {
  const checkoutSession = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { origin: "http://localhost:3000" },
  });
  const checkoutSessionJson = await checkoutSession.json();

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  });

  if (error) {
    console.warn(error.message);
  }
};

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <Box>
      <Topbar />
      {/* intro page */}
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(to right, #4A90E2, #50B8E7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Welcome to Flashcard Sass
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          The easiest way to create and study flashcards!
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mr: 2, px: 4, py: 1 }}
            href={isSignedIn ? "/generate" : "/sign-in"}
          >
            Get Started
          </Button>
          <Button variant="outlined" color="inherit" sx={{ px: 4, py: 1 }}>
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Autogenerate Flashcards",
              desc: "Simply input your topic and let AI do the rest.",
              icon: <AutoAwesomeIcon fontSize="large" />,
            },
            {
              title: "Save Your Flashcards",
              desc: "Store your flashcard sets for future reference.",
              icon: <SaveIcon fontSize="large" />,
            },
            {
              title: "Edit Flashcards",
              desc: "Modify or regenerate flashcards to match your needs.",
              icon: <EditIcon fontSize="large" />,
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ textAlign: "center", p: 3 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography>{feature.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ py: 8, background: "#F5F5F5", textAlign: "center" }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Basic",
                price: "$5 / month",
                desc: "Access to basic features",
              },
              {
                title: "Pro",
                price: "$10 / month",
                desc: "Full access with advanced features",
              },
            ].map((plan, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ p: 4, textAlign: "center", boxShadow: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {plan.title}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ my: 2 }}>
                    {plan.price}
                  </Typography>
                  <Typography sx={{ mb: 3 }}>{plan.desc}</Typography>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Choose {plan.title}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
