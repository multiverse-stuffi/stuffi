import React from "react";
import {Edit, Delete} from "@mui/icons-material";
import { Link } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

export default function StuffCard({
  item,
  getContrastingColor,
  tagColors,
  setEditModal,
  setDeleteModal,
  setViewModal,
}) {
  return (
    <Card
      sx={{
        width: 350,
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 0 15px #91AEC1",
          transform: "scale(1.0125)",
        },
      }}
    >
      <CardActions
        sx={{ display: "flex", justifyContent: "flex-end", padding: "0" }}
      >
        <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
          {item.url ? (
            <a target="_blank" rel="noreferrer" href={item.url}>
              <IconButton>
                <Link />
              </IconButton>
            </a>
          ) : (
            ""
          )}
          <IconButton aria-label="options" onClick={() => setEditModal(item)}>
            <Edit />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => setDeleteModal(item.id)}>
            <Delete />
          </IconButton>
        </Box>
      </CardActions>
      <CardMedia
        component="img"
        height="350"
        width="350"
        image={item.imgUrl ?? "/thumbtack.png"}
        alt={item.item}
        sx={{ objectFit: "cover" }}
        onClick={() => {setViewModal(item);}}
      />
      <CardContent className="card-title" onClick={() => {setViewModal(item);}}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "left" }}
        >
          {item.item}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {item.tags.map((tag) => {
            const tagStyle = tag.Tag.color
              ? {
                  tag: "#" + tag.Tag.color,
                  text: getContrastingColor(tag.Tag.color),
                }
              : tagColors[tag.tagId];
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
                {tag.Tag.isVariable ? tag.value + " " : ""}
                {tag.Tag.tag}
              </Typography>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
