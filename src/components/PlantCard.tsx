import React from 'react';
import { Plant } from '../types';
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface PlantCardProps {
    plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
    const { id, name, image, needs_care, should_water, should_repot, should_fertilize } = plant;

    return (
        <Link to={`/plants/${id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 345, m: 1}} className={needs_care? 'needsCare': ''}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={image}
                        alt={name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {needs_care ? (
                                <>
                                    {should_water && <span>💦</span>}
                                    {should_repot && <span>🪴</span>}
                                    {should_fertilize && <span>🧪</span>}
                                    &nbsp;This plant needs care!
                                </>
                            ) : (
                                <>✅ All set!</>
                            )}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default PlantCard;
