import Modal from "react-modal";
import { Close } from "@mui/icons-material";
import NextImage from "next/image";
import {
    Typography,
    IconButton,
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
        maxWidth: '90%',
        maxHeight: '90%',
        minWidth: '50%',
    },
};

Modal.setAppElement("#__next");

function ViewModal({ viewModal, setViewModal, getContrastingColor, tagColors }) {
    function closeModal() {
        setViewModal(false);
    }
    return (
        <Modal
            isOpen={!!viewModal}
            onRequestClose={closeModal}
            contentLabel="View Modal"
            style={customStyles}
        >
            <div className="right">
                <IconButton onClick={closeModal}>
                    <Close />
                </IconButton>
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <Typography variant="h4" sx={{ ml: '10px' }}>
                    {viewModal?.item}
                </Typography>
                {viewModal?.imgUrl && <NextImage
                    width={512}
                    height={512}
                    src={viewModal.imgUrl}
                    alt="Image"
                />}
                <Typography variant="h6">{viewModal?.description}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {viewModal.tags?.map((tag) => {
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
                                variant="h6"
                            >
                                {" "}
                                {tag.Tag.isVariable ? tag.value + " " : ""}
                                {tag.Tag.tag}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>
        </Modal>
    )
}

export default ViewModal;