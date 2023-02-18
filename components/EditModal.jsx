import { useState, useEffect, useRef, createRef } from "react";
import Modal from "react-modal";
import { Close, Add } from "@mui/icons-material";
import Image from "next/image";
import { getCookies } from 'cookies-next';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  Checkbox,
  FormLabel
} from "@mui/material";

const customStyles = {
  overlay: {
    overflowY: 'auto'
  },
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

function EditModal({ editModal, setEditModal, tagColors, tags, getContrastingColor, refreshData }) {
  const [item, setItem] = useState(editModal ? editModal.item : '');
  const [description, setDescription] = useState(
    editModal ? editModal.description : ''
  );
  const [url, setUrl] = useState(editModal ? editModal.url : '');
  const [imgUrl, setImgUrl] = useState(editModal ? editModal.imgUrl : '');
  const [isNew, setIsNew] = useState(editModal ? !editModal.id : null);
  const [showPreview, setShowPreview] = useState(false);
  const [itemTags, setItemTags] = useState(editModal ? editModal.tags : []);
  const [allowPreview, setAllowPreview] = useState(editModal && editModal.imgUrl ? true : false);
  const [tagModal, setTagModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [tagVariable, setTagVariable] = useState(false);
  const [modalTags, setModalTags] = useState(tags);
  useEffect(() => {
    setItem(editModal ? editModal.item : '');
    setDescription(editModal ? editModal.description : '');
    setUrl(editModal ? editModal.url : '');
    setImgUrl(editModal ? editModal.imgUrl : '');
    setAllowPreview(editModal && editModal.imgUrl ? true : false);
    setItemTags(editModal ? editModal.tags : []);
    setIsNew(editModal ? !editModal.id : null)
    document.body.style.overflow = editModal ? 'hidden' : 'unset';
  }, [editModal])
  const refs = useRef({});
  function createTagRefs() {
    const newRefs = { ...refs.current };
    for (const tag of modalTags) {
      newRefs[tag.id] = {
        check: newRefs[tag.id]?.check ?? createRef(),
        val: tag.isVariable ? newRefs[tag.id]?.val ?? createRef() : undefined
      };
    }
    refs.current = newRefs;
  }
  createTagRefs();
  useEffect(createTagRefs, [modalTags]);
  useEffect(() => { if (!allowPreview) setShowPreview(false); }, [allowPreview]);
  useEffect(() => {setModalTags(tags);}, [tags, editModal]);
  function closeModal() {
    setEditModal(false);
  }
  async function checkImage(url) {
    try {
      const res = await fetch(url, { mode: 'no-cors' });
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
        Tag = modalTags.filter(tag => tag.tagId === tagId)[0];
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
      Tag = modalTags.filter(tag => tag.tagId === tagId)[0];
      newTags.push({
        tagId,
        value: refs.current[tagId].val ? refs.current[tagId].val.current.value : null,
        Tag
      });
    }
    setItemTags(newTags); // Update state with new array
  };
  const openTagModal = () => {
    setTagModal(true);
  }
  const closeTagModal = () => {
    setTagModal(false);
    setTagName('');
    setTagColor('');
    setTagVariable(false);
  }
  const addTag = () => {
    const newTags = [...modalTags];
    const newItemTags = [...itemTags];
    const Tag = {id: 0, tag: tagName, color: tagColor, isVariable: tagVariable};
    newTags.push(Tag);
    newItemTags.push({tagId: 0, value: tagVariable ? 1 : null, Tag})
    setModalTags(newTags);
    setItemTags(newItemTags);
    closeTagModal();
  }
  const submitHandler = async () => {
    const Cookie = getCookies();
    const itemRes = await fetch(`/api/item/${isNew ? '' : editModal.id}`, {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify({ item, description, url, imgUrl }),
      headers: { Cookie }
    });
    if (isNew && itemRes.ok) {
      const data = await itemRes.json();
      editModal.id = data.id;
    }
    for (const tag of modalTags) {
      if (tag.id) continue;
      const tagRes1 = await fetch(`/api/tag`, {
        method: "POST",
        body: JSON.stringify({tag: tag.tag, color: tag.color, isVariable: tag.isVariable}),
        headers: { Cookie }
      });
      if (tagRes1.ok) {
        const json = await tagRes1.json();
        tag.id = json.id;
        for (let i = 0; i < itemTags.length; i++) {
          if (itemTags[i].tagId === 0 && itemTags[i].Tag.tag === tag.tag) itemTags[i].tagId = json.id;
        }
      }
    }
    for (const tag of modalTags) {
      const add = itemTags.some(i => i.tagId == tag.id);
      await fetch(`/api/item/${editModal.id}/tag/${tag.id}`, {
        method: add ? "POST" : "DELETE",
        body: JSON.stringify(add ? {value: itemTags.filter(i => i.tagId == tag.id)[0].value} : {}),
        headers: { Cookie }
      });
    }
    refreshData();
    setEditModal(false);
  }
  return (
    <Modal
      isOpen={!!editModal}
      onRequestClose={closeModal}
      contentLabel="Edit Modal"
      style={customStyles}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
        <Typography>
          Editing: {editModal ? (editModal.item ? editModal.item : "New Item") : null}
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
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            width: '100%',
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
              setAllowPreview(isValid);
            }}
          />
        </Box>
        {allowPreview && (
          <Typography
            className="clickable hover-underline"
            sx={{ color: "#a9a9a9", marginTop: "3px" }}
            onClick={() => {
              setShowPreview(!showPreview);
            }}
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </Typography>
        )}
        {showPreview && (
          <Image
            width={256}
            height={256}
            src={showPreview ? imgUrl : ''}
            alt="Image preview"
            style={{ border: '10px solid lightgray' }}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <List sx={{ py: 1, display: 'flex', flexDirection: 'row', gap: '20px' }}>
            {modalTags.map((tag) => {
              const tagStyle =
                tag.color ? { tag: '#' + tag.color, text: getContrastingColor(tag.color) }
                  : (tagColors[tag.id] ?? { tag: '#0A8754', text: '#fff' });
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
                        value={itemTags.filter(i => i.tagId == tag.id)[0]?.value}
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
          <Button sx={{ color: '#a9a9a9' }} onClick={openTagModal}><Add />New Tag</Button>
          <Modal
            isOpen={tagModal}
            onRequestClose={closeTagModal}
            contentLabel="Tag Modal"
            style={customStyles}
          >
            <div className="right">
              <IconButton onClick={closeTagModal}>
                <Close />
              </IconButton>
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField label="Tag Name" value={tagName} onChange={(e) => {setTagName(e.target.value)}}/>
              <TextField label="Hex Color" value={tagColor} onChange={(e) => {setTagColor(e.target.value)}}/>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Checkbox checked={tagVariable} onChange={(e) => {setTagVariable(e.target.checked)}} sx={{width: 'fit-content'}} />
                <FormLabel>Variable</FormLabel>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }} onClick={addTag}>
                <Button sx={buttonStyles}>Add</Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={submitHandler} sx={buttonStyles}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditModal;
