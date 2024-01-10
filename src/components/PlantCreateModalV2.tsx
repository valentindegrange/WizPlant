import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    createPlant,
    getUser,
    aiCheckPlant,
    getAiPlantAnswer,
    approveAiPlantAnswer,
} from '../api/api';
import {PlantFormFields} from './shared/PlantFormFields';
import {
    Dialog,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Typography,
    TextField,
} from '@mui/material';


interface PlantCreateModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const PlantCreateModalV2: React.FC<PlantCreateModalProps> = ({
                                                                 isOpen,
                                                                 onRequestClose,
                                                             }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        waterFrequencySummer: '',
        waterFrequencyWinter: '',
        sunlight: '',
        sunExposure: '',
        fertilizer: false,
        fertilizerSeason: '',
        repotting: false,
        repottingSeason: '',
        leafMist: false,
        extraTips: '',
        image: null as File | null, // Initialize image as null
    });
    const [userHasParam, setUserHasParam] = useState<boolean>(false);
    const [checkPlantStatus, setCheckPlantStatus] = useState<
        'loading' | 'success' | 'failure' | 'not_started' | 'in_progress'
    >('not_started');
    const [checkPlantResult, setCheckPlantResult] = useState<any | null>(null);
    const [isCheckingImage, setIsCheckingImage] = useState<boolean>(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [approvalStatus, setApprovalStatus] = useState<'approved' | 'not_approved'>(
        'not_approved'
    );
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndCheckParam = async () => {
            try {
                const user = await getUser();
                setUserHasParam(user.has_ai_enabled === true);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserAndCheckParam();
    }, []);

    const pollCheckPlant = async (aiPlantAnswerId: number) => {
        let response;
        let status = 'not_started';

        while (status === 'not_started' || status === 'in_progress') {
            try {
                response = await getAiPlantAnswer(aiPlantAnswerId);
                status = response.status;

                if (status === 'in_progress') {
                    setIsCheckingImage(response.is_checking_image);
                    setIsGeneratingImage(response.is_generating_image);
                }

                if (status === 'success' || status === 'failure') {
                    setCheckPlantResult(response);
                    setCheckPlantStatus(status);
                }
            } catch (error) {
                console.error('Error checking plant:', error);
                setCheckPlantStatus('failure');
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userHasParam) {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('name', formData.name);
                if (formData.image) {
                    formDataToSubmit.append('image', formData.image);
                }

                const createdPlant = await createPlant(formDataToSubmit);
                const newPlantId = createdPlant.id;

                const aiPlantAnswer = await aiCheckPlant(newPlantId);
                const aiPlantAnswerId = aiPlantAnswer.id;

                setCheckPlantStatus('in_progress');

                await pollCheckPlant(aiPlantAnswerId);
            } catch (error) {
                console.error('Error creating plant or checking plant:', error);
                setCheckPlantStatus('failure');
            }
        } else {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('name', formData.name);
                formDataToSubmit.append('description', formData.description);
                if (formData.image) {
                    formDataToSubmit.append('image', formData.image);
                }
                formDataToSubmit.append('water_frequency_summer', formData.waterFrequencySummer);
                formDataToSubmit.append('water_frequency_winter', formData.waterFrequencyWinter);
                formDataToSubmit.append('sunlight', formData.sunlight);
                formDataToSubmit.append('sun_exposure', formData.sunExposure);
                formDataToSubmit.append('fertilizer', String(formData.fertilizer));
                formDataToSubmit.append('fertilizer_season', formData.fertilizerSeason);
                formDataToSubmit.append('repotting', String(formData.repotting));
                formDataToSubmit.append('repotting_season', formData.repottingSeason);
                formDataToSubmit.append('leaf_mist', String(formData.leafMist));
                formDataToSubmit.append('extra_tips', formData.extraTips);

                const createdPlant = await createPlant(formDataToSubmit);
                const newPlantId = createdPlant.id;
                navigate(`/plants/${newPlantId}`);
                onRequestClose();
            } catch (error) {
                console.error('Error creating plant:', error);
            }
        }
    };

    const handleApproveClick = async () => {
        try {
            setIsApproving(true);
            const approvedResult = await approveAiPlantAnswer(checkPlantResult.id);
            if (approvedResult.id) {
                setApprovalStatus('approved');
                navigate(`/plants/${approvedResult.plant}`);
                onRequestClose();
            } else {
                console.error('Error approving plant answer:', approvedResult.error);
            }
        } catch (error) {
            console.error('Error approving plant answer:', error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({...formData, image: file});
    };

    const renderContent = () => {
        switch (checkPlantStatus) {
            case 'loading':
                return (
                    <Box sx={{textAlign: 'center'}}>
                        {isCheckingImage && <Typography>Checking image...</Typography>}
                        {isGeneratingImage && <Typography>Generating image...</Typography>}
                        <CircularProgress/>
                    </Box>
                );
            case 'in_progress':
                return (
                    <Box sx={{textAlign: 'center'}}>
                        <Typography>Check in progress, please wait...</Typography>
                        {isCheckingImage && <Typography>Checking image...</Typography>}
                        {isGeneratingImage && <Typography>Generating image...</Typography>}
                        <CircularProgress/>
                    </Box>
                );
            case 'success':
                return (
                    <Box>
                        <Typography>Plant successfully checked, see the details below:</Typography>
                        {/* Display the name */}
                        {checkPlantResult.json_answer?.name && (
                            <Typography variant="h6">{checkPlantResult.json_answer.name}</Typography>
                        )}

                        {/* Display the image if available */}
                        {checkPlantResult.image && (
                            <Box
                                component="img"
                                src={checkPlantResult.image}
                                alt={checkPlantResult.json_answer?.name || "Plant Image"}
                                sx={{maxWidth: '256px', height: 'auto', my: 2}}
                            />
                        )}
                        <Box component="pre">{JSON.stringify(checkPlantResult, null, 2)}</Box>
                    </Box>
                );
            case 'failure':
                return (
                    <Box>
                        <Typography>Plant check failed:</Typography>
                        <Typography>Error: {checkPlantResult?.error_message}</Typography>
                        <TextField
                            label="Name of the plant"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            fullWidth
                            margin="normal"
                        />
                        <input type="file" accept="image/*" onChange={handleImageChange}/>
                    </Box>
                );
            default:
                return (
                    <Box>
                        {userHasParam ? (
                            <>
                                <TextField
                                    label="Name of the plant"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    fullWidth
                                    margin="normal"
                                />
                                <input type="file" accept="image/*" onChange={handleImageChange}/>
                            </>
                        ) : (
                            <PlantFormFields
                                name={formData.name}
                                description={formData.description}
                                imagePreview={null}
                                imageFile={formData.image}
                                waterFrequencySummer={formData.waterFrequencySummer}
                                waterFrequencyWinter={formData.waterFrequencyWinter}
                                sunlight={formData.sunlight}
                                sunExposure={formData.sunExposure}
                                fertilizer={formData.fertilizer}
                                fertilizerSeason={formData.fertilizerSeason}
                                repotting={formData.repotting}
                                repottingSeason={formData.repottingSeason}
                                leafMist={formData.leafMist}
                                extraTips={formData.extraTips}
                                onNameChange={(name) => setFormData({...formData, name})}
                                onDescriptionChange={(description) =>
                                    setFormData({...formData, description})
                                }
                                onImageChange={(file) => setFormData({...formData, image: file})}
                                onWaterFrequencySummerChange={(value) =>
                                    setFormData({...formData, waterFrequencySummer: value})
                                }
                                onWaterFrequencyWinterChange={(value) =>
                                    setFormData({...formData, waterFrequencyWinter: value})
                                }
                                onSunlightChange={(value) =>
                                    setFormData({...formData, sunlight: value})
                                }
                                onSunExposureChange={(value) =>
                                    setFormData({...formData, sunExposure: value})
                                }
                                onFertilizerChange={(value) =>
                                    setFormData({...formData, fertilizer: value})
                                }
                                onFertilizerSeasonChange={(value) =>
                                    setFormData({...formData, fertilizerSeason: value})
                                }
                                onRepottingChange={(value) =>
                                    setFormData({...formData, repotting: value})
                                }
                                onRepottingSeasonChange={(value) =>
                                    setFormData({...formData, repottingSeason: value})
                                }
                                onLeafMistChange={(value) =>
                                    setFormData({...formData, leafMist: value})
                                }
                                onExtraTipsChange={(value) =>
                                    setFormData({...formData, extraTips: value})
                                }
                            />
                        )}
                    </Box>
                );
        }
    };

    const renderButtons = () => {
        switch (checkPlantStatus) {
            case 'loading':
            case 'in_progress':
                return null;
            case 'success':
                if (approvalStatus === 'not_approved') {
                    return (
                        <Button onClick={handleApproveClick} disabled={isApproving}>
                            Approve
                        </Button>
                    );
                } else {
                    return null;
                }
            case 'failure':
                return (
                    <Button type='submit' variant="contained">Retry</Button>
                );
            default:
                return (
                    <Button type="submit" variant="contained">
                        {userHasParam ? 'Check Plant' : 'Create Plant'}
                    </Button>
                );
        }
    };

    return (
        <Dialog fullScreen open={isOpen} onClose={() => {
        }}>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                <Box sx={{p: 2}}>
                    <Typography variant="h4">Create a Plant</Typography>
                    {renderContent()}
                    <DialogActions>
                        <Button onClick={onRequestClose}>Cancel</Button>
                        {renderButtons()}
                    </DialogActions>
                </Box>
            </form>
        </Dialog>
    );
};

export default PlantCreateModalV2;
