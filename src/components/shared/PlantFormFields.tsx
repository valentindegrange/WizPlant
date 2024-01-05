import React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

interface PlantFormFieldsProps {
  name: string;
  description: string;
  imagePreview: string | null;
  imageFile: File | null; // Add imageFile prop
  waterFrequencySummer: string;
  waterFrequencyWinter: string;
  sunlight: string;
  sunExposure: string;
  fertilizer: boolean;
  fertilizerSeason: string;
  repotting: boolean;
  repottingSeason: string;
  leafMist: boolean;
  extraTips: string;

  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onImageChange: (file: File | null) => void;
  onWaterFrequencySummerChange: (value: string) => void;
  onWaterFrequencyWinterChange: (value: string) => void;
  onSunlightChange: (value: string) => void;
  onSunExposureChange: (value: string) => void;
  onFertilizerChange: (value: boolean) => void;
  onFertilizerSeasonChange: (value: string) => void;
  onRepottingChange: (value: boolean) => void;
  onRepottingSeasonChange: (value: string) => void;
  onLeafMistChange: (value: boolean) => void;
  onExtraTipsChange: (value: string) => void;
}

export const PlantFormFields: React.FC<PlantFormFieldsProps> = ({
  name,
  description,
  imagePreview,
  imageFile, // Add imageFile prop
  waterFrequencySummer,
  waterFrequencyWinter,
  sunlight,
  sunExposure,
  fertilizer,
  fertilizerSeason,
  repotting,
  repottingSeason,
  leafMist,
  extraTips,

  onNameChange,
  onDescriptionChange,
  onImageChange,
  onWaterFrequencySummerChange,
  onWaterFrequencyWinterChange,
  onSunlightChange,
  onSunExposureChange,
  onFertilizerChange,
  onFertilizerSeasonChange,
  onRepottingChange,
  onRepottingSeasonChange,
  onLeafMistChange,
  onExtraTipsChange,
}) => {
  const sunlightOptions = ['LIGHT_EXPOSURE', 'PARTIAL_SHADE', 'SHADE'];
  const sunExposureOptions = ['DIRECT_SUN', 'NO_DIRECT_SUN'];
  const seasonOptions = ['Spring', 'Summer', 'Autumn', 'Winter'];

  return (
    <Box>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
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
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onImageChange(file);
          }}
        />
      </Box>
      {imagePreview && (
        <Box component="img" src={imagePreview} alt="Plant Preview" sx={{maxWidth: "100px", mt: 2}}/>
      )}
      <TextField
        label="Summer Watering Frequency (in days)"
        value={waterFrequencySummer}
        type={"number"}
        onChange={(e) => onWaterFrequencySummerChange(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Winter Watering Frequency (in days)"
        value={waterFrequencyWinter}
        type={"number"}
        onChange={(e) => onWaterFrequencyWinterChange(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Sunlight</InputLabel>
        <Select
          value={sunlight}
          onChange={(e) => onSunlightChange(e.target.value)}
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
          value={sunExposure}
          onChange={(e) => onSunExposureChange(e.target.value)}
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
            checked={fertilizer}
            onChange={(e) => onFertilizerChange(e.target.checked)}
          />
        }
        label="Fertilizer"
      />
      {fertilizer && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Fertilizer Season</InputLabel>
          <Select
            value={fertilizerSeason}
            onChange={(e) => onFertilizerSeasonChange(e.target.value)}
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
            checked={repotting}
            onChange={(e) => onRepottingChange(e.target.checked)}
          />
        }
        label="Repotting"
      />
      {repotting && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Repotting Season</InputLabel>
          <Select
            value={repottingSeason}
            onChange={(e) => onRepottingSeasonChange(e.target.value)}
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
            checked={leafMist}
            onChange={(e) => onLeafMistChange(e.target.checked)}
          />
        }
        label="Leaf Mist"
      />
      <TextField
        label="Extra Tips"
        value={extraTips}
        onChange={(e) => onExtraTipsChange(e.target.value)}
        fullWidth
        margin="normal"
        multiline
      />
    </Box>
  );
};
