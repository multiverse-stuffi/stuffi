import { useState } from "react";
import Modal from "react-modal";
import { Close } from "@mui/icons-material";
import Image from "next/image";
import {
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

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

const buttonStyles = {
  width: "min-content",
  whiteSpace: "nowrap",
  backgroundColor: "#508CA4",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#91AEC1",
  },
};

Modal.setAppElement("#__next");

function EditModal({ editModal, setEditModal }) {
  const [item, setItem] = useState(editModal ? editModal.item : null);
  const [description, setDescription] = useState(
    editModal ? editModal.description : null
  );
  const [url, setRrl] = useState(editModal ? editModal.url : null);
  const [imgUrl, setImgUrl] = useState(editModal ? editModal.imgUrl : null);
  const [isNew, setIsNew] = useState(editModal ? !editModal.item : null);
  function closeModal() {
    setEditModal(false);
  }

  return (
    <Modal
      isOpen={editModal}
      onRequestClose={closeModal}
      contentLabel="Edit Modal"
      style={customStyles}
    >
      <Typography sx={{ mb: "10px" }}>
        Editing: {editModal ? editModal.item ?? "New Item" : null}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <TextField
          label="Title"
          value={item}
          onChange={(e) => {
            setItem(e.target.value);
          }}
        />
        <TextField
          label="Description"
          value={description}
          multiline
          minRows={2}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField label="Tags" />
        <TextField
          label="Link"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <TextField
          label="Image Link"
          value={imgUrl}
          onChange={(e) => {
            setImgUrl(e.target.value);
          }}
        />
        {imgUrl && (
          <>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Image preview
            </Typography>
            <Box
              sx={{
                bgcolor: "lightgray",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "10px",
              }}
            >
              <Image
                width={256}
                height={256}
                src={imgUrl}
                alt="Image preview"
                objectFit="contain"
                layout="intrinsic"
              />
            </Box>
          </>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button sx={buttonStyles}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditModal;
