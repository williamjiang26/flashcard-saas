import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Box, Button, Grid, Container } from "@mui/material";
import getStripe from "./utils/get-stripe";
import Head from 'next/head'
const handleSubmit = async () => {
  const checkoutSession = await fetch('/api/checkout_sessions', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  })
  const checkoutSessionJson = await checkoutSession.json()

  const stripe = await getStripe()
  const {error} = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  })

  if (error) {
    console.warn(error.message)
  }
}

const content = (<Box>
  

 

 


</Box>

);
export default function Home() {
  return (
    <Container maxWidth='lg'>
      <Head>
        <title>Flashcard Saas</title>
        <meta name='description' content="Create flashcard from your text"/>
      </Head>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' style={{flexGrow: 1}}>Flashcard Sass</Typography>
          <SignedOut>
            <Button color='inherit' href='/sign-in'>Login</Button>
            <Button color='inherit' href='/sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{textAlign: 'center'}}>
        <Typography variant="h2" component="h1" gutterBottom>Welcome to Flashcard Sass</Typography>
        <Typography variant="h5" component="h2" gutterBottom>Easiest way to create your flashcards</Typography>
        <Button variant='contained' color='primary' sx={{mt: 2, mr: 2}} href='/generate'>Get Started</Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>Learn more</Button>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          {/* Feature items */}
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Easy Input Text</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Feature 2</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Feature 3</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} md={4}>
            <Box sx={{my:6, textAlign}}
            >
              <Typography variant='h6'>Easy Input Text</Typography>
              <Typography>
                {' '}
                Simply input your text and let our software do the rest
              </Typography>
            </Box>
            
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Feature 2</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Feature 3</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
