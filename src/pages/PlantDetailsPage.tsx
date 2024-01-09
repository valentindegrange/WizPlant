import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getPlant } from "../api/api";
import { Plant } from "../types";
import PlantDetails from "../components/PlantDetails";
import PlantEditModalV2 from "../components/PlantEditModalV2";
import { Box, Button, CircularProgress } from '@mui/material';


const PlantDetailsPage: React.FC = () => {
    const [plant, setPlant] = useState<Plant | null>(null);
    const { id } = useParams<{ id: string }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Define fetchPlantData function within the component
    const fetchPlantData = useCallback(async () => {
        try {
            if (id) {
                const plantData = await getPlant(id);
                setPlant(plantData);
            }
        } catch (error) {
            console.error("Error fetching plant:", error);
        }
    }, [id]);

    useEffect(() => {
        // Call fetchPlantData when the component mounts
        fetchPlantData();
    }, [fetchPlantData]);

    const handleEditSuccess = () => {
        // Close the edit modal and refetch plant data
        setIsEditModalOpen(false);
        fetchPlantData(); // Refetch plant data after a successful edit
    };

    const handlePlantActionSuccess = () => {
        // Refetch plant data after a successful plant action
        fetchPlantData();
    }

    return (
        <Box sx={{ p: 2 }}>
            {plant ? (
                <>
                    <Button onClick={() => setIsEditModalOpen(true)} variant="outlined">📝</Button>
                    <PlantEditModalV2
                        isOpen={isEditModalOpen}
                        onRequestClose={() => setIsEditModalOpen(false)}
                        plant={plant}
                        onEditSuccess={handleEditSuccess}
                    />
                    <PlantDetails plant={plant} onPlantActionSuccess={handlePlantActionSuccess}/>


                </>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default PlantDetailsPage;
