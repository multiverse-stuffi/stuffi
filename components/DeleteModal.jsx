import Modal from 'react-modal';
import { Close } from '@mui/icons-material';
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
  InputAdornment,
} from '@mui/material';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
    maxWidth: '90%',
    maxHeight: '90%',
  },
};

const buttonStyles = {
  width: 'min-content',
  whiteSpace: 'nowrap',
  backgroundColor: '#ff3333',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#e02d2d',
  },
};

Modal.setAppElement('#__next');

function DeleteModal({
  items,
  setItems,
  deleteModal,
  setDeleteModal,
}) {
  const confirmDelete = async () => {
    await fetch(`/api/items/${deleteModal}`, {
      method: 'DELETE',
      headers: { Cookie: getCookies() },
    });
    setItems(items.filter((i) => i.id !== deleteModal));
    closeModal();
  };
  const closeModal = () => {
    setDeleteModal(false);
  };
  return (
    <Modal
      isOpen={!!deleteModal}
      onRequestClose={closeModal}
      contentLabel='Delete Modal'
      style={customStyles}>
      <Typography>This will permanently delete this item.</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          mt: '10px',
        }}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button onClick={confirmDelete} sx={buttonStyles}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

export default DeleteModal;
