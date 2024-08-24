"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
 collection,
 deleteDoc,
 doc,
 getDoc,
 getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import {
 Container,
 Button,
 Grid,
 Card,
 Box,
 Typography,
 CardContent,
 CardActionArea,
} from "@mui/material";
import Topbar from "../topbar/page";

export default function Flashcard() {
 const [flashcards, setFlashcards] = useState([]);
 const [flipped, setFlipped] = useState({});
 const { isLoaded, isSignedIn, user } = useUser();

 const searchParams = useSearchParams();
 const search = searchParams.get("id");

 useEffect(() => {
  async function getFlashcard() {
   if (!search || !user) return;
   const colRef = collection(doc(collection(db, "users"), user.id), search);
   const docs = await getDocs(colRef);
   const flashcards = [];
   docs.forEach((doc) => {
    flashcards.push({ id: doc.id, ...doc.data() });
   });
   setFlashcards(flashcards);
  }
  getFlashcard();
 }, [user, search]);

 const handleCardClick = (id) => {
  setFlipped((prev) => ({
   ...prev,
   [id]: !prev[id],
  }));
 };

 if (!isLoaded || !isSignedIn) {
  return <></>;
 }

 const handleDelete = async () => {
  const colRef = collection(doc(collection(db, "users"), user.id), search);
  const docs = await getDocs(colRef);
  // const flashcards = []
  // docs.forEach((doc) => {
  //     flashcards.push({id: doc.id, ...doc.data()})
  // })
  console.log(docs);
 };

 return (
  <Box height="100vh" width="100vw">
   <Topbar />
   <Box m="20px">
    <Box sx={{ display: "flex", justifyItems: "space-between" }}>
     <Typography variant="h4">Flashcards Preview:</Typography>
     <Typography component="span" variant="h4" sx={{ color: "blue" }}>
      {search}
     </Typography>
    </Box>

    <Grid container sx={{ mt: 4 }}>
     <Grid container spacing={2}>
      {flashcards.map((flashcard, index) => (
       <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
         <CardActionArea
          onClick={() => {
           handleCardClick(index);
          }}
         >
          <CardContent>
           <Box
            sx={{
             perspective: "1000px",
             "& > div": {
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
              position: "relative",
              width: "100%",
              height: "200px",
              boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
              transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
             },
             "& > div > div": {
              position: "absolute",
              width: "100%",
              height: "200px",
              backfaceVisibility: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2",
              boxSizing: "border-box",
             },
             "& > div > div:nth-of-type(2)": {
              transform: "rotateY(180deg)",
             },
            }}
           >
            <div>
             <div>
              {/* <Typography variant="h6">Front:</Typography> */}
              <Typography variant="h6" sx={{ mt: 2 }}>
               {flashcard.front}
              </Typography>
             </div>
             <div>
              {/* <Typography variant="h6">Back:</Typography> */}
              <Typography variant="h6" sx={{ mt: 2 }}>
               {flashcard.back}
              </Typography>
             </div>
            </div>
           </Box>
          </CardContent>
         </CardActionArea>
        </Card>
       </Grid>
      ))}
     </Grid>
    </Grid>
   </Box>
  </Box>
 );
}
