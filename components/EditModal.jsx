import { useState, useEffect, useRef, createRef, useCallback } from "react";
import Modal from "react-modal";
import { Close, Add } from "@mui/icons-material";
import NextImage from "next/image";
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
  FormLabel,
  InputAdornment
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
    maxWidth: '90%',
    maxHeight: '90%',
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

function EditModal({ editModal, setEditModal, tagColors, tags, getContrastingColor, setTags, setItems, items }) {
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
  const [itemError, setItemError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [tagError, setTagError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  useEffect(() => {
    setItem(editModal ? editModal.item : '');
    setDescription(editModal ? editModal.description : '');
    setUrl(editModal ? editModal.url : '');
    setImgUrl(editModal ? editModal.imgUrl : '');
    setAllowPreview(editModal && editModal.imgUrl ? true : false);
    setIsNew(editModal ? !editModal.id : null)
    setItemError(false);
    setImgError(false);
    setUrlError(false);
    setDescriptionError(false);
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
  useEffect(() => { setModalTags(tags); }, [tags, editModal]);
  useEffect(() => { setItemTags(editModal ? [...editModal.tags] : []); }, [editModal]);
  function closeModal() {
    setEditModal(false);
  }
  function checkImage(imageSrc) {
    var img = new Image();
    img.onload = () => { setAllowPreview(true) };
    img.onerror = () => { setAllowPreview(false) };
    img.src = imageSrc;
  }
  const handleTag = (tagId) => {
    let newTags = [...itemTags]; // Copy what we currently have
    let done = false;
    const Tag = modalTags.filter(tag => tag.id === tagId)[0];
    for (let i = 0; i < newTags.length; i++) { // Loop through our copy
      if (newTags[i].tagId !== tagId) continue; // Skip it if it is not the tag we just modified
      if (refs.current[tagId].check.current.checked) {
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
    setTagError(false);
    setColorError(false);
  }
  const addTag = () => {
    if (!tagName.trim()) {
      setTagError(true);
      return;
    }
    if (tagColor.trim() && !/^[A-Za-z0-9]{6}$/.test(tagColor.trim())) {
      setColorError(true);
      return;
    }
    const newTags = [...modalTags];
    const newItemTags = [...itemTags];
    const Tag = { id: 0, tag: tagName, color: tagColor, isVariable: tagVariable };
    newTags.push(Tag);
    newItemTags.push({ tagId: 0, value: tagVariable ? 1 : null, Tag })
    setItemTags(newItemTags);
    setModalTags(newTags);
    closeTagModal();
  }
  const submitHandler = async () => {
    if (!item.trim()) {
      setItemError('Title required');
      return;
    }
    if (item.trim().length > 255) {
      setItemError('Maximum length is 255 characters');
      return;
    }
    if (description && description.trim().length > 510) {
      setDescriptionError(true);
      return;
    }
    if (url && url.trim().length > 510) {
      setUrlError(true);
      return;
    }
    if (imgUrl && imgUrl.trim() && !allowPreview) {
      setImgError('Invalid image url');
      return;
    }
    if (imgUrl && imgUrl.trim().length > 510) {
      setImgError('Maximum url length is 510 characters. Try using a url shortener.');
      return;
    }
    const Cookie = getCookies();
    const itemRes = await fetch(`/api/item/${isNew ? '' : editModal.id}`, {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify({ item, description, url, imgUrl }),
      headers: { Cookie }
    });
    let dbItem;
    if (itemRes.ok) {
      dbItem = await itemRes.json();
      if (isNew) editModal.id = dbItem.id;
    }
    let newTags = false;
    for (const tag of modalTags) {
      if (tag.id) continue;
      newTags = true;
      const tagRes1 = await fetch(`/api/tag`, {
        method: "POST",
        body: JSON.stringify({ tag: tag.tag, color: tag.color, isVariable: tag.isVariable }),
        headers: { Cookie }
      });
      if (tagRes1.ok) {
        const json = await tagRes1.json();
        tag.id = json.id;
        for (let i = 0; i < itemTags.length; i++) {
          if (itemTags[i].tagId === 0 && itemTags[i].Tag.tag === tag.tag) {
            itemTags[i].tagId = json.id;
          }
        }
      }
    }
    for (const tag of modalTags) {
      const add = itemTags.filter(i => i.tagId == tag.id)[0];
      const originalTag = editModal.tags.filter(i => i.tagId == tag.id)[0];
      if (!!originalTag === !!add && add?.value === originalTag?.value) continue;
      await fetch(`/api/item/${editModal.id}/tag/${tag.id}`, {
        method: add ? (originalTag ? "PUT" : "POST") : "DELETE",
        body: JSON.stringify(add ? { value: itemTags.filter(i => i.tagId == tag.id)[0].value } : {}),
        headers: { Cookie }
      });
    }
    if (newTags) setTags(modalTags);
    dbItem.tags = itemTags;
    const itemsCopy = [...items];
    if (isNew) for (let i = 0; i < itemsCopy.length; i++) {
      if (itemsCopy[i].tags.length <= itemTags.length) {
        itemsCopy.splice(i, 0, dbItem);
        break;
      }
    }
    else {
      let found = false;
      let placed = false;
      dbItem.new = true;
      let idx;
      for (let i = 0; i < itemsCopy.length; i++) {
        if (!placed && ((itemsCopy[i].tags.length < itemTags.length) || (itemsCopy[i].tags.length === itemTags.length && itemsCopy[i].id >= dbItem.id))) {
          itemsCopy.splice(i, 0, dbItem);
          idx = i;
          placed = true;
        }
        if (itemsCopy[i].id === dbItem.id && !itemsCopy[i].new) {
          itemsCopy.splice(i, 1);
          found = true;
          if (!placed) i--;
        }
        if (found && placed) break;
      }
      if (!placed) {
        dbItem.new = false;
        itemsCopy.push(dbItem);
      } else itemsCopy[idx].new = false;

    }
    setItems(itemsCopy);
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
              setItemError(false);
              setItem(e.target.value);
            }}
            error={itemError}
            helperText={itemError ? itemError : null}
          />
          <TextField
            label="Description"
            value={description}
            multiline
            minRows={2}
            onChange={(e) => {
              setDescriptionError(false);
              setDescription(e.target.value);
            }}
            error={descriptionError}
            helperText={descriptionError ? 'Maximum length is 510 characters' : null}
          />
          <TextField
            label="Link"
            value={url}
            onChange={(e) => {
              setUrlError(false);
              setUrl(e.target.value);
            }}
            error={urlError}
            helperText={urlError ? 'Maximum length is 510 characters. Try a using a url shortener.' : null}
          />
          <TextField
            label="Image Link"
            value={imgUrl}
            onChange={async (e) => {
              setImgError(false);
              setImgUrl(e.target.value);
              if (e.target.value) {
                checkImage(e.target.value);
              } else setAllowPreview(false);
            }}
            error={imgError}
            helperText={imgError ? imgError : null}
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
            View Preview
          </Typography>
        )}
        <Modal
          isOpen={showPreview}
          onRequestClose={() => { setShowPreview(false); }}
          contentLabel="Image preview"
          style={customStyles}
        >
          <div className="right">
            <IconButton onClick={() => { setShowPreview(false); }}>
              <Close />
            </IconButton>
          </div>
          <NextImage
            width={256}
            height={256}
            src={showPreview ? imgUrl : ''}
            alt="Image preview"
            style={{ border: '10px solid lightgray' }}
          />
        </Modal>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <List sx={{ py: 1, display: 'flex', flexDirection: 'row', gap: '5px 20px', flexWrap: 'wrap' }}>
            {modalTags.map((tag) => {
              const tagStyle =
                tag.color ? { tag: '#' + tag.color, text: getContrastingColor(tag.color) }
                  : (tagColors[tag.id] ?? { tag: '#0A8754', text: '#fff' });
              return (
                <ListItem key={tag.id ? tag.id : tag.tag} disablePadding sx={{ width: 'min-content' }}>
                  <Checkbox
                    checked={itemTags.some(i => tag.id > 0 ? i.tagId == tag.id : tag.tag === i.Tag.tag && i.tagId == 0)}
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
                        value={itemTags.filter(i => tag.id > 0 ? i.tagId == tag.id : i.Tag.tag == tag.tag)[0]?.value}
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
              <TextField label="Tag Name"
                value={tagName}
                onChange={(e) => { setTagError(false); setTagName(e.target.value) }}
                error={tagError}
                helperText={tagError ? 'Name required' : null}
              />
              <TextField
                label="Hex Color"
                value={tagColor}
                onChange={(e) => { setColorError(false); setTagColor(e.target.value) }}
                error={colorError}
                helperText={colorError ? 'Must be a 6 character hex value' : null}
                InputProps={{
                  startAdornment:
                    <InputAdornment disableTypography position="start">
                      #</InputAdornment>,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={tagVariable} onChange={(e) => { setTagVariable(e.target.checked) }} sx={{ width: 'fit-content' }} />
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
