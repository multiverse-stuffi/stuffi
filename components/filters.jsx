import { useState, useRef, createRef, useEffect } from "react";
import { ExpandCircleDownOutlined, AddBoxOutlined } from "@mui/icons-material";
import {
    Typography,
    Checkbox,
    Box,
    List,
    ListItem,
    ListItemText,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton
} from "@mui/material";

function Filters({ getContrastingColor, tags, filterMode, setFilterMode, setFilters, filters, tagColors, sort, setSort, sortMode, setSortMode, setEditModal }) {
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [sortExpanded, setSortExpanded] = useState(false);
    const refs = useRef({});
    const createTagRefs = () => {
        for (const tag of tags) {
            refs.current[tag.id] = {};
            refs.current[tag.id].check = refs.current[tag.id].check ?? createRef();
            if (tag.isVariable) {
                refs.current[tag.id].comp = refs.current[tag.id].comp ?? createRef();
                refs.current[tag.id].val = refs.current[tag.id].val ?? createRef();
            }
        }
    }
    createTagRefs();
    useEffect(createTagRefs, [tags]);

    const filterToggle = () => {
        setFiltersExpanded(!filtersExpanded);
    };

    const sortToggle = () => {
        setSortExpanded(!sortExpanded);
    };

    const handleFilterMode = (e) => {
        setFilterMode(e.target.value);
    };

    const handleFilter = (tagId) => {
        let newFilters = [...filters]; // Copy what we currently have
        let done = false;
        for (let i = 0; i < newFilters.length; i++) { // Loop through our copy
            if (newFilters[i].id !== tagId) continue; // Skip it if it is not the tag we just modified
            if (refs.current[tagId].check.current.checked) newFilters[i] = { // If we get here, that means we found the tag we just changed. If the box is checked, let's update it to reflect the current values we entered (checkbox, number field)
                id: tagId,
                value: refs.current[tagId].val ? refs.current[tagId].val.current.value : null,
                compType: refs.current[tagId].comp ? refs.current[tagId].comp.current.value : null
            };
            else newFilters.splice(i, 1); // If we got here but the checkbox is unchecked, delete it from our array
            done = true; // Keep track that we finished what we wanted to do
            break; // We already found the one and only item we wanted, so we can stop looping
        }
        if (!done && refs.current[tagId].check.current.checked) { // If we didn't finish what we wanted to do, and the box is checked, BoxOutlined it to the array
            newFilters.push({ id: tagId, value: refs.current[tagId].val ? refs.current[tagId].val.current.value : null, compType: refs.current[tagId].comp ? refs.current[tagId].comp.current.value : null });
        }
        setFilters(newFilters); // Update state with new array
    };

    const handleSortMode = (e) => {
        setSortMode(e.target.value);
    };

    const handleSort = (e) => {
        setSort(e.target.value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '25px', gap: '20px' }}>
            <Box sx={{height: 'fit-content', mt: '2px'}}>
                <IconButton onClick={() => {setEditModal({item: '', description: '', url: '', imgUrl: '', tags: []})}}>
                    <AddBoxOutlined/>
                </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", border: '1px solid #91AEC1', borderRadius: '8px', overflow: 'hidden', width: '75%', height: 'fit-content' }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: 'space-between',
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: filtersExpanded ? '1px solid #91AEC1' : 'none',
                        bgcolor: '#BFD7EA',
                        padding: '5px'
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: '100%'
                        }}
                        onClick={filterToggle}
                    >
                        <ExpandCircleDownOutlined sx={{ transform: filtersExpanded ? "none" : "rotate(-90deg)" }} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            Filter
                        </Typography>
                    </Box>
                    <Button sx={{ padding: '0' }} onClick={() => { setFilters([]); }}>Clear</Button>
                </Box>
                <Box sx={{ display: filtersExpanded ? 'flex' : 'none' }}>
                    <Box sx={{ width: '80%' }}>
                        <List sx={{ py: 1, display: 'flex', flexDirection: 'row', gap: '5px 20px', width: '100%', flexWrap: 'wrap' }}>
                            {tags.map((tag) => {
                                const tagStyle =
                                    tag.color ? { tag: '#' + tag.color, text: getContrastingColor(tag.color) }
                                        : (tagColors[tag.id] ?? { tag: '#fff', text: '#000' });
                                return (
                                    <ListItem key={tag.tag} sx={{width: 'fit-content'}} disablePadding>
                                        <Checkbox
                                            checked={filters.some(i => i.id == tag.id)}
                                            onChange={() => { handleFilter(tag.id) }}
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
                                                }}
                                            />
                                        </Box>
                                        {tag.isVariable && (
                                            <>
                                                <Select
                                                    defaultValue={'=='}
                                                    size="small"
                                                    sx={{ ml: '5px' }}
                                                    inputProps={{ ref: refs.current[tag.id].comp }}
                                                    onChange={() => { if (refs.current[tag.id].check.current.checked) setTimeout(handleFilter, 1, tag.id) }}
                                                >
                                                    <MenuItem value=">">&gt;</MenuItem>
                                                    <MenuItem value=">=">&gt;=</MenuItem>
                                                    <MenuItem value="==">=</MenuItem>
                                                    <MenuItem value="<=">&lt;=</MenuItem>
                                                    <MenuItem value="<">&lt;</MenuItem>
                                                </Select>
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
                                                    inputProps={{
                                                        ref: refs.current[tag.id].val
                                                    }}
                                                    onChange={() => { if (refs.current[tag.id].check.current.checked) handleFilter(tag.id); }}
                                                    defaultValue={''}
                                                />
                                            </>
                                        )}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                    <Box sx={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControl>
                            <FormLabel sx={{ display: 'inline' }}>Mode</FormLabel>
                            <RadioGroup
                                value={filterMode}
                                row={true}
                                onChange={handleFilterMode}
                            >
                                <FormControlLabel value="or" control={<Radio />} label="or" />
                                <FormControlLabel value="and" control={<Radio />} label="and" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", border: '1px solid #91AEC1', borderRadius: '8px', overflow: 'hidden', width: '25%', height: 'fit-content' }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: sortExpanded ? '1px solid #91AEC1' : 'none',
                        bgcolor: '#BFD7EA',
                        padding: '5px'
                    }}
                    onClick={sortToggle}
                >
                    <ExpandCircleDownOutlined sx={{ transform: sortExpanded ? "none" : "rotate(-90deg)" }} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        Sort
                    </Typography>
                </Box>
                <Box sx={{ display: sortExpanded ? 'flex' : 'none', justifyContent: 'space-between', pt: '5px' }}>
                    <FormControl sx={{ ml: '20px' }}>
                        <FormLabel sx={{ display: 'inline' }}>Sort by</FormLabel>
                        <Select
                            defaultValue={0}
                            size="small"
                            sx={{ height: 'min-content' }}
                            onChange={handleSort}
                        >
                            <MenuItem value={0}>Tag count</MenuItem>
                            {tags.filter(tag => tag.isVariable).map(tag => (
                                <MenuItem value={tag.id} key={tag.id}>{tag.tag}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel sx={{ display: 'inline' }}>Mode</FormLabel>
                        <RadioGroup
                            value={sortMode}
                            onChange={handleSortMode}
                        >
                            <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
                            <FormControlLabel value="desc" control={<Radio />} label="Descending" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    );
}

export default Filters;