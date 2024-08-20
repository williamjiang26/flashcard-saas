import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";


export default function SignUpPage(){
    const Navbar = (
    <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
        <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>
            Flashcard SaaS
        </Typography>
        <Button color="inherit">
            <Link href="/login" passHref>
            Login
            </Link>
        </Button>
        </Toolbar>
    </AppBar>)

    
    return (
        <Box>
            <Navbar/>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{textAlign: 'center', my: 4}}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                Sign In
                </Typography>
                <SignIn />
            </Box>
        </Box>
    )
}