"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  writeBatch,
  setDoc,
  getDocs,
  query,
  userDocRef,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Card,
  Box,
  Stack,
  Typography,
  CardContent,
  CardActionArea,
} from "@mui/material";
import Topbar from "../topbar/page";
import { blue } from "@mui/material/colors";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const [collectionName, setCollectionName] = useState({});
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedflashcard, setFlashcard] = useState({ front: "", back: "" });
  const [newCard, setNewCard] = useState({ front: "", back: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // on snapshot
  useEffect(() => {
    if (!search || !user?.id) return;
    const colRef = collection(db, "users", user.id, search);
    setCollectionName(colRef);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const flashcardsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlashcards(flashcardsArray);
      },
      (error) => {
        console.error("Listener failed:", error);
      }
    );
    return () => unsubscribe();
  }, [user?.id, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdd = async () => {
    if (!newCard) {
      alert("Please enter some text to generate flashcard");
      return;
    }
    try {
      const batch = writeBatch(db);
      const cardDocRef = doc(collectionName);
      batch.set(cardDocRef, newCard);
      await batch.commit();
      alert("Flashcard saved successfully");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred generating flashcards. Please try again");
    }

    handleClose();
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleDelete = async () => {
    if (!selectedflashcard || Object.keys(selectedflashcard).length === 0) {
      alert("No card selected");
      return;
    }

    const cardDocRef = doc(db, "users", user.id, search, selectedflashcard.id);
    try {
      await deleteDoc(cardDocRef); // Corrected line: pass the DocumentReference object
      setIsEdit(false);
      alert("Card deleted!");
    } catch (e) {
      console.error("Delete failed:", e);
      // You can also log the full error object for more detail:
      // console.error("Full error object:", JSON.stringify(e));
    }
    setFlashcard(null);
  };

  //
  const handleEdit = async () => {
    console.log("🚀 ~ handleEdit ~ selectedflashcard:", selectedflashcard);
    if (!selectedflashcard || Object.keys(selectedflashcard).length === 0) {
      alert("No card selected");
      return;
    }
    const cardDocRef = doc(db, "users", user.id, search, selectedflashcard.id);
    try {
      // pop up a modal with front and back
      // update that card id with new front or back
      await updateDoc(cardDocRef, {
        front: selectedflashcard.front,
        back: selectedflashcard.back,
      });
      setEditOpen(false);
    } catch (e) {
      console.error("Delete failed:", e);
      // You can also log the full error object for more detail:
      // console.error("Full error object:", JSON.stringify(e));
    }
    setFlashcard(null);
  };

  return (
    <Box height="100vh" width="100vw">
      {/* --- The Dialog Popup --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Flashcard</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Front (Question)"
              fullWidth
              variant="outlined"
              value={newCard.front}
              onChange={(e) =>
                setNewCard({ ...newCard, front: e.target.value })
              }
            />
            <TextField
              label="Back (Answer)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newCard.back}
              onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            sx={{ borderRadius: "20px" }}
          >
            Save Card
          </Button>
        </DialogActions>
      </Dialog>
      {/* --- Edit Dialog Popup --- */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Flashcard</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Front (Question)"
              fullWidth
              variant="outlined"
              value={selectedflashcard?.front}
              onChange={(e) =>
                setFlashcard({ ...selectedflashcard, front: e.target.value })
              }
            />
            <TextField
              label="Back (Answer)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={selectedflashcard?.back}
              onChange={(e) =>
                setFlashcard({ ...selectedflashcard, back: e.target.value })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            sx={{ borderRadius: "20px" }}
          >
            Edit Card
          </Button>
        </DialogActions>
      </Dialog>
      <Topbar />
      <Box m="20px">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: "1" }}
          >
            <Typography variant="h4" sx={{ mr: 1 }}>
              Flashcards Preview:
            </Typography>
            <Typography component="span" variant="h4" sx={{ color: "blue" }}>
              {search}
            </Typography>
          </Box>

          {!isEdit ? (
            <Box>
              <Button
                sx={{
                  border: "2px solid transparent", // Reserve space for the border
                  "&:hover": {
                    bgcolor: "white",
                    color: "#1976d2",
                    borderColor: "#1976d2", // Creates an "outline" effect on hover
                  },
                  px: 3,
                  borderRadius: "10px",
                  bgcolor: "#1976d2", // Standard MUI Blue
                  color: "white",
                }}
                onClick={handleOpen}
              >
                Add Flashcard
              </Button>
              <Button
                sx={{
                  border: "2px solid transparent", // Reserve space for the border
                  "&:hover": {
                    bgcolor: "white",
                    color: "#1976d2",
                    borderColor: "#1976d2", // Creates an "outline" effect on hover
                  },
                  px: 3,
                  borderRadius: "10px",
                  bgcolor: "#1976d2", // Standard MUI Blue
                  color: "white",
                }}
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Edit Flashcard
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                sx={{
                  border: "2px solid transparent", // Reserve space for the border
                  "&:hover": {
                    bgcolor: "white",
                    color: "#1976d2",
                    borderColor: "#1976d2", // Creates an "outline" effect on hover
                  },
                  px: 3,
                  borderRadius: "10px",
                  bgcolor: "#1976d2", // Standard MUI Blue
                  color: "white",
                }}
                onClick={() => {
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                sx={{
                  border: "2px solid transparent", // Reserve space for the border
                  "&:hover": {
                    bgcolor: "white",
                    color: "#1976d2",
                    borderColor: "#1976d2", // Creates an "outline" effect on hover
                  },
                  px: 3,
                  borderRadius: "10px",
                  bgcolor: "#1976d2", // Standard MUI Blue
                  color: "white",
                }}
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                sx={{
                  border: "2px solid transparent", // Reserve space for the border
                  "&:hover": {
                    bgcolor: "white",
                    color: "#1976d2",
                    borderColor: "#1976d2", // Creates an "outline" effect on hover
                  },
                  px: 3,
                  borderRadius: "10px",
                  bgcolor: "#1976d2", // Standard MUI Blue
                  color: "white",
                }}
                onClick={() => {
                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    border:
                      (flashcard === selectedflashcard) & isEdit
                        ? "2px solid #1976d2"
                        : "",
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                      // if is edit is true then set selected card
                      {
                        isEdit ? setFlashcard(flashcard) : null;
                      }
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
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
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
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                              {flashcard.front}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                              {flashcard.back}
                            </Typography>
                          </Box>
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
