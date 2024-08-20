import { useUser } from "@clerk/nextjs";
import { CardActionArea, CardContent, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { getDoc, getDocs, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const router = useRouter()

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    // The component uses a `useEffect` hook to fetch the user’s flashcard sets 
    // when the component mounts or when the user changes
    // useEffect(() => {
    //     async function getFlashcards() {
    //         if (!user) return
    //         const docRef = doc(collection(db, 'users'), user.id)
    //         const docSnap = await getDoc(docRef)
    //         if(docSnap.exists()) {
    //             const collections = docSnap.data().flashcards || []
    //             setFlashcards(collections)
    //         } else {
    //             await setDoc(docRef, {flashcards: []})
    //         }
    //     }
    //     getFlashcards()
    // },[])
    useEffect(() => {
        async function getFlashcard() {
            if(!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => {
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{ /* Styling for flip animation */ }}>
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {flashcard.back}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                })}
            </Grid>
        </Container>
    )

}