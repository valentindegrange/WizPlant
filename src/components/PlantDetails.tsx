import React from 'react';
import {Plant} from '../types';
import {fertilizePlant, repotPlant, waterPlant} from "../api/api";
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PlantDetailProps {
    plant: Plant;
}

const PlantDetails: React.FC<PlantDetailProps> = ({plant}) => {
    const handleWaterPlant = async () => {
        try {
            if (plant.id !== undefined) {
                // Call the waterPlant function with the plant's ID
                await waterPlant(plant.id);
            } else {
                console.log('Plant ID is undefined');
            }
            // You can add any success handling code here
        } catch (error) {
            console.error('Error watering plant:', error);
        }
    };
    const handleRepotPlant = async () => {
        try {
            if (plant.id !== undefined) {
                await repotPlant(plant.id);
            } else {
                console.log('Plant ID is undefined');
            }
            // You can add any success handling code here
        } catch (error) {
            console.error('Error repotting plant:', error);
        }
    };

    const handleFertilizePlant = async () => {
        try {
            if (plant.id !== undefined) {
                await fertilizePlant(plant.id);
            } else {
                console.log('Plant ID is undefined');
            }
            // You can add any success handling code here
        } catch (error) {
            console.error('Error fertilizing plant:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4">{plant.name}</Typography>
            <Typography sx={{pt:2, pb:2}} variant="subtitle2" gutterBottom={true}>{plant.description}</Typography>
            <Box
                component="img"
                sx={{ maxWidth: '100%', height: 'auto' }}
                src={plant.image}
                alt={plant.name}
            />

            <Button variant="contained" color={plant.should_water ? 'primary': 'secondary'}  onClick={handleWaterPlant} sx={{ m: 1 }}>💦 Water</Button>
            <Button variant="contained" color={plant.should_repot ? 'primary': 'secondary'}  onClick={handleRepotPlant} sx={{ m: 1 }}>🪴 Repot</Button>
            <Button variant="contained" color={plant.should_fertilize ? 'primary': 'secondary'}  onClick={handleFertilizePlant} sx={{ m: 1 }}>🧪 Fertilize</Button>
            <Typography sx={{pt:2, pb:2}}>{plant.extra_tips}</Typography>
            <Typography sx={{pb:2}}>{plant.needs_care ? 'Needs Care' : 'No Extra Care Needed'}</Typography>
            <Typography>🌤️ {plant.sunlight} - {plant.sun_exposure}</Typography>
            <Typography>💧 Every {plant.water_frequency} days</Typography>
            {plant.leaf_mist && <Typography>🍃💦</Typography>}
            <Accordion sx={{mt:2, mb:2}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Caring Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Last watered: {plant.last_watered}</Typography>
                    {plant.fertilizer && (
                        <>
                            <Typography>🧪 Fertilize in {plant.fertilizer_season}</Typography>
                            <Typography>Last fertilized: {plant.last_fertilized}</Typography>
                            <Typography>Next: {plant.next_fertilize_date}</Typography>
                        </>
                    )}
                    {plant.repotting && (
                        <>
                            <Typography>🪴 Repot in {plant.repotting_season}</Typography>
                            <Typography>Last repotted: {plant.last_repotted}</Typography>
                            <Typography>Next: {plant.next_repotting_date}</Typography>
                        </>
                    )}
                    <Typography>Plant added: {plant.created}, last updated: {plant.updated}</Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default PlantDetails;
