import React, {useEffect, useState} from "react";
import {editPlant, deletePlant} from "../api/api";
import {Plant} from "../types";
import {useNavigate} from "react-router-dom";
import {sunlightOptions, sunExposureOptions, seasonOptions} from '../constants/constants';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Box,
    Typography, TextField, InputLabel, FormControl, Select, MenuItem, FormControlLabel, Checkbox,
} from '@mui/material';

interface PlantEditModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    plant: Plant | null;
    onEditSuccess: () => void;
}

const PlantEditModal: React.FC<PlantEditModalProps> = ({
                                                           isOpen,
                                                           onRequestClose,
                                                           plant,
                                                           onEditSuccess,
                                                       }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: plant?.name || "",
        description: plant?.description || "",
        image: plant?.image || "",
        water_frequency_summer: plant?.water_frequency_summer || "",
        water_frequency_winter: plant?.water_frequency_winter || "",
        sunlight: plant?.sunlight || "",
        sun_exposure: plant?.sun_exposure || "",
        extra_tips: plant?.extra_tips || "",
        fertilizer: plant?.fertilizer || false,
        fertilizer_season: plant?.fertilizer_season || "",
        repotting: plant?.repotting || false,
        repotting_season: plant?.repotting_season || "",
        leaf_mist: plant?.leaf_mist || false
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(plant?.image || null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        if (plant) {
            setFormData({
                ...plant
            });
            setImagePreview(plant.image || null);
        }
    }, [plant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target) {
                    setImagePreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            // Reset to original image if no file is selected
            setImagePreview(plant?.image || null);
        }
    };

    const handleConfirmDelete = async () => {
        setIsConfirmDeleteOpen(true);
    };

    const handleDeletePlant = async () => {
        try {
            if (plant?.id) {
                // Call the deletePlant API function with the plant's ID
                await deletePlant(plant.id);

                // Plant deletion successful, close the modal and trigger the success callback
                onRequestClose();
                onEditSuccess();

                // Redirect to the list of plants using navigate
                navigate("/plants");
            }
        } catch (error) {
            console.error("Error deleting plant:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (plant?.id) {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('name', formData.name);
                formDataToSubmit.append('description', formData.description);
                formDataToSubmit.append('water_frequency_summer', formData.water_frequency_summer);
                formDataToSubmit.append('water_frequency_winter', formData.water_frequency_winter);
                formDataToSubmit.append('sunlight', formData.sunlight);
                formDataToSubmit.append('sun_exposure', formData.sun_exposure);
                formDataToSubmit.append('extra_tips', formData.extra_tips);
                formDataToSubmit.append('fertilizer', formData.fertilizer.toString());
                formDataToSubmit.append('fertilizer_season', formData.fertilizer_season);
                formDataToSubmit.append('repotting', formData.repotting.toString());
                formDataToSubmit.append('repotting_season', formData.repotting_season);
                formDataToSubmit.append('leaf_mist', formData.leaf_mist.toString());
                
                if (selectedFile) {
                    formDataToSubmit.append("image", selectedFile);
                }

                try {
                    await editPlant(plant.id, formDataToSubmit);
                    onRequestClose();
                    onEditSuccess();
                } catch (error) {
                    console.error("Error editing plant:", error);
                }
            }
        } catch (error) {
            console.error("Error editing plant:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Plant</DialogTitle>
            <DialogContent>
                {isConfirmDeleteOpen ? (
                    <Box textAlign="center">
                        <Typography>Are you sure you want to delete this plant?</Typography>
                        <Button onClick={handleDeletePlant} color="primary">Yes</Button>
                        <Button onClick={() => setIsConfirmDeleteOpen(false)}>No</Button>
                    </Box>
                ) : (
                    <>
                        <DialogActions>
                            <Button onClick={handleConfirmDelete} color="error">Delete Plant</Button>
                        </DialogActions>
                        <form onSubmit={handleSubmit}>
                            <Box>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                    fullWidth
                                    margin="normal"
                                />

                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                />
                                <Box mt={2}>
                                    <InputLabel htmlFor="image">Image</InputLabel>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                </Box>
                                {imagePreview && (
                                    <Box component="img" src={imagePreview} alt="Plant Preview"
                                         sx={{maxWidth: "100px", mt: 2}}/>
                                )}
                                <TextField
                                    label="Summer Watering Frequency (in days)"
                                    name="water_frequency_summer"
                                    value={formData.water_frequency_summer || ""}
                                    type={"number"}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Winter Watering Frequency (in days)"
                                    name="water_frequency_winter"
                                    value={formData.water_frequency_winter || ""}
                                    type={"number"}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                    fullWidth
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Sunlight</InputLabel>
                                    <Select
                                        name="sunlight"
                                        value={formData.sunlight || ""}
                                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                        label="Sunlight"
                                    >
                                        {sunlightOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Sun Exposure</InputLabel>
                                    <Select
                                        name="sun_exposure"
                                        value={formData.sun_exposure || ""}
                                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                        label="Sun Exposure"
                                    >
                                        {sunExposureOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="fertilizer"
                                            checked={formData.fertilizer}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Fertilizer"
                                />
                                {formData.fertilizer && (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Fertilizer Season</InputLabel>
                                        <Select
                                            name="fertilizer_season"
                                            value={formData.fertilizer_season || ""}
                                            onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                            label="Fertilizer Season"
                                        >
                                            {seasonOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="repotting"
                                            checked={formData.repotting}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Repotting"
                                />
                                {formData.repotting && (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Repotting Season</InputLabel>
                                        <Select
                                            name="repotting_season"
                                            value={formData.repotting_season || ""}
                                            onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                            label="Repotting Season"
                                        >
                                            {seasonOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="leaf_mist"
                                            checked={formData.leaf_mist}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Leaf Mist"
                                />
                                <TextField
                                    label="Extra Tips"
                                    name="extra_tips"
                                    value={formData.extra_tips || ""}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                />
                            </Box>
                            <DialogActions>
                                <Button onClick={onRequestClose}>Cancel</Button>
                                <Button type="submit" color="primary">Save Changes</Button>
                            </DialogActions>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PlantEditModal;
