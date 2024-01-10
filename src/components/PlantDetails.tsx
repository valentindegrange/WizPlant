import React, {useEffect, useState} from 'react';
import {Plant} from '../types';
import {fertilizePlant, repotPlant, waterPlant, getNextPlantNeedsCareId} from "../api/api";
import {Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails, Link} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Link as RouterLink} from "react-router-dom";


interface PlantDetailProps {
    plant: Plant;
    onPlantActionSuccess: () => void;
}

const PlantDetails: React.FC<PlantDetailProps> = ({plant, onPlantActionSuccess}) => {
    const [nextPlant, setNextPlant] = useState<any | null>(null);
    useEffect(() => {
        if (!plant.needs_care) {
            fetchNextPlant();
        }
    }, [plant.needs_care]);


    const fetchNextPlant = async () => {
        const response = await getNextPlantNeedsCareId();
        setNextPlant(response.plant);
    }
    const handleWaterPlant = async () => {
        try {
            if (plant.id !== undefined) {
                // Call the waterPlant function with the plant's ID
                await waterPlant(plant.id);
                onPlantActionSuccess();
                if (!plant.needs_care) {
                    fetchNextPlant();
                }
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
                onPlantActionSuccess();
                if (!plant.needs_care) {
                    fetchNextPlant();
                }
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
                onPlantActionSuccess();
                if (!plant.needs_care) {
                    fetchNextPlant();
                }
            } else {
                console.log('Plant ID is undefined');
            }
            // You can add any success handling code here
        } catch (error) {
            console.error('Error fertilizing plant:', error);
        }
    };

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h4">{plant.name}</Typography>
            <Typography sx={{pt: 2, pb: 2}} variant="subtitle2" gutterBottom={true}>{plant.description}</Typography>
            <Box
                component="img"
                sx={{maxWidth: '75%', height: 'auto', display: 'block', margin: 'auto'}}
                src={plant.image}
                alt={plant.name}
            />

            {plant.needs_care ? (
                <></>
            ) : (
                <Box textAlign='right'>
                    <Typography sx={{pt:2, pb: 2}}>
                        {nextPlant ? (
                            <Link component={RouterLink} to={`/plants/${nextPlant}`}>
                                Next Plant
                            </Link>
                        ) : (
                            <></>
                        )}
                    </Typography>
                </Box>
            )}
            <Box textAlign='center'>
                <Button variant="contained" color={plant.should_water ? 'primary' : 'secondary'}
                        onClick={handleWaterPlant}
                        sx={{m: 1}}>💦 Water</Button>
                <Button variant="contained" color={plant.should_repot ? 'primary' : 'secondary'}
                        onClick={handleRepotPlant}
                        sx={{m: 1}}>🪴 Repot</Button>
                <Button variant="contained" color={plant.should_fertilize ? 'primary' : 'secondary'}
                        onClick={handleFertilizePlant} sx={{m: 1}}>🧪 Fertilize</Button>
            </Box>


            <Typography sx={{pt: 2, pb: 2}}>{plant.extra_tips}</Typography>
            <Typography>🌤️ {plant.sunlight} - {plant.sun_exposure}</Typography>
            <Typography>💧 Every {plant.water_frequency} days</Typography>
            {plant.leaf_mist && <Typography>🍃💦</Typography>}
            <Accordion sx={{mt: 2, mb: 2}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
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
                    <Typography>Plant added: {plant.created}</Typography>
                    <Typography>last updated: {plant.updated}</Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default PlantDetails;
