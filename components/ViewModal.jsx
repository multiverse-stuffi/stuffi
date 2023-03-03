import { useRef } from 'react';
import Modal from "react-modal";
import { Close, Link } from "@mui/icons-material";
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
    const ref = useRef(null);
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" ref={ref} sx={{textAlign: 'center'}}>
                        {viewModal?.item}
                    </Typography>
                    {viewModal?.url && (
                        <Box sx={{position: 'absolute', left: `calc(50% + ${ref.current?.offsetWidth/2}px)`}}>
                            <a target="_blank" rel="noreferrer" href={viewModal.url}>
                                <IconButton>
                                    <Link sx={{ height: '40px', width: '40px' }} />
                                </IconButton>
                            </a>
                        </Box>
                    )}
                </Box>
                {viewModal?.imgUrl && <NextImage
                    width={512}
                    height={512}
                    src={viewModal.imgUrl}
                    alt="Image"
                    style={{ objectFit: 'cover' }}
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