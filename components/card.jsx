import React from "react";
import Edit from "@mui/icons-material/Edit";
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

function getContrastingColor(backgroundColor) {
  // convert hex color code to RGB values
  let r = parseInt(backgroundColor.substring(0,2), 16);
  let g = parseInt(backgroundColor.substring(2,4), 16);
  let b = parseInt(backgroundColor.substring(4,6), 16);

  // apply the luminosity contrast formula
  let luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminosity > 0.5 ? '#000' : '#fff';
}

export default function StuffCard(props) {
  const item = props.item;
  const tagColors = [
    { tag: "#bfd7ea", text: "#000" },
    { tag: "#91aec1", text: "#000" },
    { tag: "#508ca4", text: "#fff" },
    { tag: "#0a8754", text: "#fff"},
    { tag: "#004f2d", text: "#fff"}
  ];

  return (
    <Card sx={{ width: 350 }}>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0' }}>
        <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
          {item.url ?
            <a target="_blank" href={item.url}>
              <IconButton >
                <Link />
              </IconButton>
            </a>
            : ''}
          <IconButton aria-label="options">
            <Edit />
          </IconButton>
        </Box>
      </CardActions>
      <CardMedia
        component="img"
        height="350"
        width="350"
        image={item.imgUrl ?? '/thumbtack.png'}
        alt={item.item}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent className="card-title">
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'left' }}>
          {item.item}
        </Typography>
        <div className="tags">
          <Box>
            <Grid
              sx={{ display: "flex", flexWrap: "wrap" }}
            >
              {item.tags.slice(0, 5).map((tag) => {
                const tagStyle =
                  tag.Tag.color ? {tag: '#'+tag.Tag.color, text: getContrastingColor(tag.Tag.color)}
                  : tagColors[Math.floor(Math.random() * tagColors.length)];
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
                    key={tag.tagId}
                    variant="body2"
                  >
                    {" "}
                    {tag.Tag.isVariable ? tag.value+' ' : ''}{tag.Tag.tag}
                  </Typography>
                );
              })}
              {item.tags.length > 5 ? <Typography sx={{ color: "#A9A9A9" }}>{item.tags.length - 5} more...</Typography> : ""}
            </Grid>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}
