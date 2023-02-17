import { useState, useEffect, useRef, createRef } from "react";
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
  Checkbox
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

function EditModal({ editModal, setEditModal, tagColors, tags, getContrastingColor }) {
  const [item, setItem] = useState(editModal ? editModal.item : '');
  const [description, setDescription] = useState(
    editModal ? editModal.description : ''
  );
  const [url, setUrl] = useState(editModal ? editModal.url : '');
  const [imgUrl, setImgUrl] = useState(editModal ? editModal.imgUrl : '');
  const [isNew, setIsNew] = useState(editModal ? !editModal.item : null);
  const [showPreview, setShowPreview] = useState(editModal && editModal.imgUrl ? true : false);
  const [itemTags, setItemTags] = useState(editModal ? editModal.tags : []);
  useEffect(() => {
    setItem(editModal ? editModal.item : '');
    setDescription(editModal ? editModal.description : '');
    setUrl(editModal ? editModal.url : '');
    setImgUrl(editModal ? editModal.imgUrl : '');
    setShowPreview(editModal && editModal.imgUrl ? true : false);
    setItemTags(editModal ? editModal.tags : []);
  }, [editModal])
  const refs = useRef({});
  function createTagRefs() {
    const newRefs = {...refs.current}; 
    for (const tag of tags) {
      newRefs[tag.id] = {
        check: newRefs[tag.id]?.check ?? createRef(),
        val: tag.isVariable ? newRefs[tag.id]?.val ?? createRef() : undefined
      };
    }
    refs.current = newRefs; 
  }
  createTagRefs();
  useEffect(createTagRefs, [itemTags]);
  function closeModal() {
    setEditModal(false);
  }
  async function checkImage(url) {
    try {
      const res = await fetch(url);
      const buff = await res.blob();
      return buff.type.startsWith('image/');
    } catch (e) {
      return false;
    }

  }
  const handleTag = (tagId) => {
    let newTags = [...itemTags]; // Copy what we currently have
    let done = false;
    let Tag = null;
    for (let i = 0; i < newTags.length; i++) { // Loop through our copy
      if (newTags[i].tagId !== tagId) continue; // Skip it if it is not the tag we just modified
      if (refs.current[tagId].check.current.checked) {
        Tag = tags.filter(tag => tag.tagId === tagId)[0];
        newTags[i] = { // If we get here, that means we found the tag we just changed. If the box is checked, let's update it to reflect the current values we entered (checkbox, number field)
          tagId,
          value: refs.current[tagId].val ? refs.current[tagId].val.current.value : null,
          Tag
        }
      }
      else newTags.splice(i, 1); // If we got here but the checkbox is unchecked, delete it from our array
      done = true; // Keep track that we finished what we wanted to do
      break; // We already found the one and only item we wanted, so we can stop looping
    }
    if (!done && refs.current[tagId].check.current.checked) { // If we didn't finish what we wanted to do, and the box is checked, add it to the array
      if (!Tag) Tag = tags.filter(tag => tag.tagId === tagId)[0];
      newTags.push({
        tagId,
        value: refs.current[tagId].val ? refs.current[tagId].val.current.value : null,
        Tag
      });
    }
    setItemTags(newTags); // Update state with new array
  };
  return (
    <Modal
      isOpen={!!editModal}
      onRequestClose={closeModal}
      contentLabel="Edit Modal"
      style={customStyles}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
        <Typography>
          Editing: {editModal ? editModal.item ?? "New Item" : null}
        </Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
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
          onChange={async (e) => {
            setImgUrl(e.target.value);
            const isValid = await checkImage(e.target.value);
            setShowPreview(isValid);
          }}
        />
        {showPreview && (
          <>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Image preview
            </Typography>
            <Box
              sx={{
                bgcolor: "lightgray",
                borderRadius: "10px",
                p: "10px",
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Image
                width={256}
                height={256}
                src={showPreview ? imgUrl : ''}
                alt="Image preview"
              />
            </Box>
          </>
        )}
        <Box>
          <List sx={{ py: 1, display: 'flex', flexDirection: 'row', gap: '20px' }}>
            {tags.map((tag) => {
              const tagStyle =
                tag.color ? { tag: '#' + tag.color, text: getContrastingColor(tag.color) }
                  : (tagColors[tag.id] ?? { tag: '#fff', text: '#000' });
              return (
                <ListItem key={tag.id} disablePadding>
                  <Checkbox
                    checked={itemTags.some(i => i.tagId == tag.id)}
                    onChange={() => { handleTag(tag.id); }}
                    value={tag.id}
                    inputProps={{ ref: refs.current[tag.id].check }}
                  />
                  <Box sx={{ display: "inline-flex" }}>
                    <ListItemText
                      primary={tag.tag}
                      sx={{
                        bgcolor: tagStyle.tag,
                        color: tagStyle.text,
                        py: "2px",
                        px: "8px",
                        borderRadius: "4px",
                        mr: "4px"
                      }}
                    />
                  </Box>
                  {tag.isVariable && (
                    <>
                      <TextField
                        type="number"
                        size="small"
                        sx={{
                          width: '55px',
                          "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                          "input[type=number]": {
                            MozAppearance: "textfield",
                          },
                        }}
                        onChange={() => { handleTag(tag.id) }}
                        defaultValue={''}
                        inputProps={{
                          ref: refs.current[tag.id].val
                        }}
                      />
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button sx={buttonStyles}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditModal;
