import React, { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import { Link } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Modal from "react-modal";

export default function View({
  item,
  getContrastingColor,
  tagColors,
  setEditModal,
  openModal,
  handleModalClose
}) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "10px",
    },
  };
  return (
    <Modal
      openModal={openModal}
      onRequestClose={() => setOpenModal(false)}
      contentLabel="View Modal"
      style={customStyles}
    >
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
          </Box>
        </CardActions>
        <CardMedia
          component="img"
          height="350"
          width="350"
          image={item.imgUrl ?? "/thumbtack.png"}
          alt={item.item}
          sx={{ objectFit: "cover" }}
        />
        <CardContent className="card-title">
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "left" }}
          >
            {item.item}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {item.tags.slice(0, 5).map((tag) => {
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
            {item.tags.length > 5 ? (
              <Typography sx={{ color: "#A9A9A9" }}>
                {item.tags.length - 5} more...
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
}
