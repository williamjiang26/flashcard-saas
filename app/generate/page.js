'use client'
import { useState } from "react"
import {
    Grid,
    Card,
    TextField,
    Box,
    Button,
    Typography,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CardActionArea
} from "@mui/material";

import { doc, getDoc, writeBatch, setDoc, collection} from "firebase/firestore"
import {db} from '@/firebase'
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs";

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const { isLoaded, isSignedIn, user } = useUser()
    const router = useRouter()

    const handleSubmit = async() => {
        if(!text.trim()){
            alert('Please enter some text to generate flashcards')
            return
        }
        try{
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            })

            if (!response.ok){
                throw new Error('Failed to generate flashcards')
            }

            const data = await response.json()
            setFlashcards(data)
        } catch (error){
            console.error('Error generating flashcards:', error)
            alert('An error occurred generating flashcards. Please try again')
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    // First, let’s add a state for the flashcard set name and the dialog open state:
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)

    // Next, let’s add functions to handle opening and closing the dialog:
    const handleOpen = () => setDialogOpen(true)
    const handleClose = () => setDialogOpen(false)

    // Now, let’s implement the function to save flashcards to Firebase:
    const saveFlashcards = async () => {
        if(!setName.trim()) {
            alert('Please enter a valid name for your flashcard set')
        }
        
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)
        
        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === setName)) {
                alert('Flashcard set already exists')
                return
            }else{
                collections.push({setName})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{setName}]})
        }

        const colRef = collection(userDocRef, setName)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        alert('Flashcards saved successfully!')
        handleClose()
        router.push('/flashcards')
    
    }


    return(
        <Box height='100vh'>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component='h1' gutterBottom>
                    Generate Flashcards
                </Typography>
                <TextField 
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant='outlined'
                sx={{ mb: 2}}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                >
                    Generate Flashcards
                </Button>
                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" color='primary' onClick={handleOpen}>
                            Save Flashcards
                        </Button>
                    </Box>
                )}
            </Box>
            {/* flashcard rendering */}
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component='h2' gutterBottom>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}> 
                                <Card>
                                    <CardActionArea
                                    onClick={() => {handleCardClick(index)}}
                                    >
                                        <CardContent> 
                                        <Box sx={{
                                          perspective: '1000px',
                                          '& > div' : {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position:'relative',
                                            width: '100%',
                                            height: '200px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                          },
                                          '& > div > div' : {
                                            position:'absolute',
                                            width: '100%',
                                            height: '200px',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            padding: '2',
                                            boxSizing: 'border-box'
                                          },
                                          '& > div > div:nth-of-type(2)' : {
                                            transform: 'rotateY(180deg)'
                                        }}}
                                        > 
                                        <div>
                                          <div>
                                            {/* <Typography variant="h6">Front:</Typography> */}
                                            <Typography variant="h6" sx={{ mt: 2 }}>{flashcard.front}</Typography>
                                          </div>  
                                          <div>
                                            {/* <Typography variant="h6">Back:</Typography> */}
                                            <Typography variant="h6" sx={{ mt: 2 }}>{flashcard.back}</Typography>
                                          </div>  
                                        </div>
                                        </Box>
                                        </CardContent>
                                    </CardActionArea>
                                    
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box>
                        <Button variant="contained" color='secondary' onClick={handleOpen}>Save</Button>
                    </Box>
                </Box>
            )}
            {/* dailog component */}
            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>Save Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a new name for your flashcard set:
                    </DialogContentText>
                    <TextField
                    autoFocus
                    margin="dense"
                    label="Set Name"
                    type="text"
                    fullWidth
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} color='secondary'>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}