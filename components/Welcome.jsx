import { Typography } from "@mui/material";

export default function Welcome() {
    return (
        <>
            <Typography
              variant="h1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Welcome to Stuffi!
            </Typography>
            <Typography
                variant="h4"
                color="text.secondary"
                sx={{ textAlign: "center" }}
            >
                Please log in or sign up to continue. All you need is a username and password!
            </Typography>
            <Typography
                variant="h6"
                color="text.primary"
                sx={{ textAlign: "center", mt: '2em' }}
            >
                Once logged in, you&apos;ll be able to organize, sort, and filter ideas.<br/>
            </Typography>
            <Typography
                color="text.primary"
                sx={{ textAlign: "center", mt: '.5em' }}
            >
                <b>Looking for a new car?</b> Add the ones you&apos;re considering, tag them with your favorite features and key details, and compare them side-by-side! <br/>
            </Typography>
            <Typography
                color="text.primary"
                sx={{ textAlign: "center", mt: '.5em' }}
            >
                <b>Need to keep track of your favorite recipes?</b> Add them to Stuffi, tag them with ingredients, and filter by what you have on hand! <br/>
            </Typography>
            <Typography
                color="text.primary"
                sx={{ textAlign: "center", mt: '.5em' }}
            >
                <b>Trying to find the perfect gift?</b> Add gift ideas for your loved ones, tag them with their interests, and filter by price! <br/>
            </Typography>
            <Typography
                color="text.primary"
                sx={{ textAlign: "center", mt: '.5em' }}
            >
                <b>Have a lot of ideas for your next home improvement project?</b> Add them to Stuffi, tag them by room and price, and filter by what you want to do next! <br/>
            </Typography>
        </>
    )
}