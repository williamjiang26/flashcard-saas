import {AppBar,Box, Toolbar, Typography, Button } from "@mui/material"
import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
import FolderIcon from '@mui/icons-material/Folder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const Topbar = () => {
    return (
    <AppBar position='static'>
    <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
        <Box>
           <Button color="inherit" href='/'>
            <Typography variant='h6' >
            Flashcard Sass
            </Typography>
            </Button> 
        </Box>
        <Box sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
             <SignedOut>
                <Button color='inherit' href='/sign-in'>Login</Button>
                <Button color='inherit' href='/sign-up'>Sign Up</Button>
            </SignedOut>
            <SignedIn>
            <Box>
                <Button color='inherit' href='/generate'><AutoAwesomeIcon fontSize="medium"/></Button>
                <Button color='inherit' href='/flashcards'><FolderIcon fontSize="medium"/></Button>  
            </Box>
            <UserButton/>
            </SignedIn>
        </Box>
        
     
    </Toolbar>
  </AppBar>)
}

export default Topbar