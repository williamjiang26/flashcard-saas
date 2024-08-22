'use client'
import { useUser } from "@clerk/nextjs";
import { Container,  Card, CardActionArea, CardContent, Typography, Grid, Box } from "@mui/material";
import {db} from '@/firebase'
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useSearchParams, useRouter  } from "next/navigation";
import { use, useEffect, useState } from "react";
import Topbar from "../topbar/page";
import DeleteIcon from '@mui/icons-material/Delete';


export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])

    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }else{
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    },[user])

    if(!isLoaded || !isSignedIn){
        return (<></>)
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }


    return (
        <Box height="100vh">
            <Topbar/>
            <Box m='20px'>
             <Grid container spacing={2} sx={{mt:4}}>
                 {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}> 
                    <Card sx={{display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
                        <CardActionArea
                        onClick={() => handleCardClick(flashcard.setName)}
                        >
                            <CardContent>
                                  <Typography variant='h6'>{flashcard.setName}</Typography>  
                            </CardContent>
                        </CardActionArea>
                        
                    </Card>
                    </Grid>
                ))}   
            </Grid>   
            </Box>
            
        </Box>
    )
}