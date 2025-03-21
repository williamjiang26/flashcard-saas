"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
 Typography,
 Box,
 CircularProgress,
 Grid,
 Container,
} from "@mui/material";

const ResultPage = () => {
 const searchParams = useSearchParams();
 const session_id = searchParams.get("session_id");

 const [loading, setLoading] = useState(true);
 const [session, setSession] = useState(null);
 const [error, setError] = useState(null);

 useEffect(() => {
  const fetchCheckoutSession = async () => {
   if (!session_id) return;
   try {
    const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
    const sessionData = await res.json();
    if (res.ok) {
     setSession(sessionData);
    } else {
     setError(sessionData.error);
    }
   } catch (error) {
    setError("An error occurred while retrieving the session", error);
    console.log(error);
   } finally {
    setLoading(false);
   }
  };
  fetchCheckoutSession();
 }, [session_id]);

 if (loading) {
  return (
   <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
    <CircularProgress />
    <Typography variant="h6" sx={{ mt: 2 }}>
     Loading...
    </Typography>
   </Container>
  );
 }

 if (error) {
  return (
   <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
    <Typography variant="h6" color="error">
     {error}
    </Typography>
   </Container>
  );
 }
 return (
  <Box width="100vw" height="100vh" sx={{ textAlign: "center", mt: 4 }}>
   {session.payment_status === "paid" ? (
    <>
     <Typography variant="h4">Thank you for your purchase!</Typography>
     <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Session ID: {session_id}</Typography>
      <Typography variant="body1">
       We have received your payment. You will receive an email with the order
       details shortly.
      </Typography>
     </Box>
    </>
   ) : (
    <>
     <Typography variant="h4">Payment failed</Typography>
     <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
       Your payment was not successful. Please try again.
      </Typography>
     </Box>
    </>
   )}
  </Box>
 );
};

export default ResultPage;
