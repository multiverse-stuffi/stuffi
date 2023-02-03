import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";
import { Link } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

export default function StuffCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="194"
        image="https://static.wikia.nocookie.net/disney/images/1/10/Profile_-_Lightning_McQueen.png/revision/latest?cb=20221003093816"
        alt="Lightning McQueen"
      />
      <CardContent className="card-title">
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box></Box>
          <Typography variant="h6" color="text.secondary">
            Lightning McQueen
          </Typography>
          <div sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Box>
              <IconButton>
                <Link />
              </IconButton>
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Box>
          </div>
        </Stack>
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
