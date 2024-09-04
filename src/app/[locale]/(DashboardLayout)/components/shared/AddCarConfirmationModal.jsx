import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Input,
  InputLabel,
  Divider,
  Stack,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const AddCarConfirmationModal = ({ open, handleClose, car, handleConfirmAdd }) => {
  const [photos, setPhotos] = useState(car?.photos || []);
  const [newPhotos, setNewPhotos] = useState([]);
  const [condition, setCondition] = useState(car?.condition || '');
  const [features, setFeatures] = useState(car?.features || '');
  const [price, setPrice] = useState(car?.price || '');

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setNewPhotos(prevPhotos => [...prevPhotos, ...photoUrls]);
  };

  const handleConfirmAddWithPhotos = () => {
    handleConfirmAdd({
      ...car,
      photos: [...photos, ...newPhotos],
      condition,
      features,
      price,
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-car-confirmation-title"
      aria-describedby="add-car-confirmation-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: '90%', sm: 700 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: 2,
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: '#888',
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: '#555',
            },
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              id="add-car-confirmation-title"
              variant="h5"
              component="h2"
              gutterBottom
            >
              Confirm Addition
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Car Preview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Car Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ maxWidth: 600, mx: 'auto' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={car?.photos?.[0] || '/images/products/img1.jpg'}
                    alt={car?.name || 'Car Image'}
                  />
                  <CardContent>
                    <Typography variant="h6">{car?.name || 'Car Name'}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {car?.model || 'Car Model'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {car?.description || 'Car Description'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Additional Fields */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Additional Details
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Condition"
                variant="outlined"
                fullWidth
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
              <TextField
                label="Features"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Photos Section */}
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              Photos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {photos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo}
                      alt={`Car Photo ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
              {newPhotos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={`new-${index}`}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo}
                      alt={`New Photo ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Upload New Photos */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Input
                type="file"
                id="upload-photos"
                multiple
                onChange={handlePhotoChange}
                sx={{
                  borderRadius: 1,
                  border: '1px solid #ccc',
                  padding: '6px 8px',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
              <FormHelperText>
                You can select multiple files.
              </FormHelperText>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddWithPhotos}
              color="primary"
              variant="contained"
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCarConfirmationModal;
