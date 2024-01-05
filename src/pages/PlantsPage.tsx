import React, {useEffect, useState, useRef, useCallback} from 'react';
import PlantCard from '../components/PlantCard';
import {Grid, Typography, Box, Button, ButtonGroup} from '@mui/material';
import PlantCreateModalV2 from '../components/PlantCreateModalV2';
import {Plant} from "../types";
import {getPlants} from "../api/api";

interface QueryParams {
    ordering: string;
    page: number;
    is_complete?: boolean; // Optional property
    needs_care?: boolean; // Optional property
}

const PlantsPage = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [plantFilter, setPlantFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loader = useRef(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPlants = useCallback(async () => {
        setIsLoading(true);
        try {
            let queryParams: QueryParams = {'ordering': '-created', 'page': page};
            if (plantFilter === 'needs_care') {
                queryParams = {...queryParams, is_complete: true, needs_care: true};
            } else if (plantFilter === 'incomplete') {
                queryParams = {...queryParams, is_complete: false};
            } else {
                queryParams = {...queryParams, is_complete: true};
            }
            const data = await getPlants(queryParams);
            setPlants(prev => page === 1 ? data.results : [...prev, ...data.results]);
            setHasMore(data.next != null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, plantFilter]);

    useEffect(() => {
        fetchPlants();
    }, [fetchPlants]);

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const callback = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(callback, {
            root: null,
            rootMargin: "20px",
            threshold: 0.1
        });

        if (loader.current) {
            observer.current.observe(loader.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loader, hasMore, isLoading]);

    const handlePlantFilterChange = (newPlantFilter: React.SetStateAction<string>) => {
        if (observer.current) observer.current.disconnect();
        setPlantFilter(newPlantFilter);
        setPage(1);
        setPlants([]);
        setHasMore(true);
        setIsLoading(false); // Reset loading status
    };

    return (
        <Box sx={{flexGrow: 1, padding: 3}}>
            <Typography variant="h4" gutterBottom>
                My Plants
            </Typography>

            {plants.length > 0 ? (
                <>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={() => handlePlantFilterChange('all')}
                                color={plantFilter === 'all' ? 'secondary' : 'primary'}>All</Button>
                        <Button onClick={() => handlePlantFilterChange('needs_care')}
                                color={plantFilter === 'needs_care' ? 'secondary' : 'primary'}>Needs Care</Button>
                        <Button onClick={() => handlePlantFilterChange('incomplete')}
                                color={plantFilter === 'incomplete' ? 'secondary' : 'primary'}>Incomplete</Button>
                    </ButtonGroup>
                    <Grid container spacing={2}>
                        {plants.map(plant => (
                            <Grid item xs={12} sm={6} md={6} key={plant.id}>
                                <PlantCard plant={plant}/>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (plantFilter === 'all' ? (
                <Box>
                    <Typography variant="body1">
                        Welcome to WizPlant! <br/>It seems you don't have any plants yet! <br/>
                        Don't worry! Let's start by adding one 🙂
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsModalOpen(true)}
                        sx={{mt: 2}}
                    >
                        Add Plant
                    </Button>
                </Box>
            ) : (
                <></>
            ))}
            <div ref={loader} style={{height: "20px"}}/>

            {/* Plant Create Modal */}
            {isModalOpen && (
                <PlantCreateModalV2
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                />
            )}
        </Box>
    );
};

export default PlantsPage;
