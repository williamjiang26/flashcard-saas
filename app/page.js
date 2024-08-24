"use client";
import {
 Typography,
 Box,
 Button,
 Grid,
 Container,
 MenuItem,
} from "@mui/material";
import getStripe from "./utils/get-stripe";
import Topbar from "./topbar/page";
import { useUser } from "@clerk/nextjs";

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
   <Box sx={{ textAlign: "center", alignContent: "center" }} height="100vh">
    <Typography variant="h2" component="h1" gutterBottom>
     Welcome to Flashcard Sass
    </Typography>
    <Typography variant="h5" component="h2" gutterBottom>
     Easiest way to create your flashcards
    </Typography>
    {console.log(isSignedIn)}

    <Button
     variant="contained"
     color="primary"
     sx={{ mt: 2, mr: 2 }}
     href={isSignedIn ? "/generate" : "/sign-in"}
    >
     Get Started
    </Button>
    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
     Learn more
    </Button>
   </Box>

   {/* features page */}
   <Box
    sx={{ my: 6, textAlign: "center", alignContent: "center" }}
    height="100vh"
   >
    <Typography variant="h4" component="h2" gutterBottom>
     Features
    </Typography>
    <Grid container spacing={4}>
     {/* Feature items */}
     <Grid item xs={12} md={4}>
      <Typography variant="h6">Easy Input Text</Typography>
      <Typography>
       {" "}
       Simply input your text and let our software do the rest
      </Typography>
     </Grid>
     <Grid item xs={12} md={4}>
      <Typography variant="h6">Feature 2</Typography>
      <Typography>
       {" "}
       Simply input your text and let our software do the rest
      </Typography>
     </Grid>
     <Grid item xs={12} md={4}>
      <Typography variant="h6">Feature 3</Typography>
      <Typography>
       {" "}
       Simply input your text and let our software do the rest
      </Typography>
     </Grid>
    </Grid>
   </Box>

   {/* pricing page */}
   <Box
    sx={{ my: 6, textAlign: "center", alignContent: "center" }}
    height="100vh"
   >
    <Typography variant="h4" component="h2" gutterBottom>
     Pricing
    </Typography>
    <Grid container spacing={4} justifyContent="center">
     {/* Pricing plans */}
     <Grid item xs={12} md={6}>
      <Box
       sx={{
        p: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
       }}
      >
       <Typography variant="h5">Basic</Typography>
       <Typography variant="h6">$5 / month</Typography>
       <Typography> Access to the most basic features</Typography>
       <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
       >
        Choose Basic
       </Button>
      </Box>
     </Grid>
     <Grid item xs={12} md={6}>
      <Box
       sx={{
        p: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
       }}
      >
       <Typography variant="h5">Pro</Typography>
       <Typography variant="h6">$10 / month</Typography>
       <Typography> Access to the most basic features</Typography>
       <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
       >
        Choose Pro
       </Button>
      </Box>
     </Grid>
    </Grid>
   </Box>
  </Box>
 );
}
