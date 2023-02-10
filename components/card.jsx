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
import { Grid } from "@mui/material";

export default function StuffCard(image, tags) {
  const testTags = [
    "car",
    "red",
    "fast",
    "racing",
    "speed",
    "Disney",
    "cartoon",
    "animation",
  ];
  const tagColors = [
    { tag: "#efbdeb", text: "#000" },
    { tag: "#b68cb8", text: "#fff" },
    { tag: "#6461a0", text: "#fff" },
  ];
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
        <div className="tags">
          <Box>
            <Grid
              sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
            >
              {testTags.slice(0, 5).map((tag) => {
                const tagStyle =
                  tagColors[Math.floor(Math.random() * tagColors.length)];
                return (
                  <Typography
                    sx={{
                      backgroundColor: tagStyle.tag,
                      color: tagStyle.text,
                      padding: ".25rem .5rem",
                      marginRight: ".5rem",
                      marginBottom: ".5rem",
                      borderRadius: ".25rem",
                    }}
                    key={tag}
                    variant="body2"
                  >
                    {" "}
                    #{tag}
                  </Typography>
                );
              })}
              {testTags.length > 5 ? <Typography sx = {{color: "#A9A9A9"}}>{testTags.length - 5} more...</Typography> : ""}
            </Grid>
          </Box>
        </div>
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
