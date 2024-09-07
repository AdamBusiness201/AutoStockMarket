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
  FormControl,
  FormHelperText,
  Divider,
  Stack,
  TextField
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";

const AddCarConfirmationModal = ({ open, handleClose, car, handleConfirmAdd }) => {
  const t = useTranslations('default.cars.carAdditionModal'); // Hook for translations
  const [photos, setPhotos] = useState(car?.photos || []);
  const [newPhotos, setNewPhotos] = useState([]);
  const [condition, setCondition] = useState(car?.condition || "");
  const [features, setFeatures] = useState(car?.features || "");
  const [price, setPrice] = useState(car?.price || "");

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map((file) => URL.createObjectURL(file));
    setNewPhotos((prevPhotos) => [...prevPhotos, ...photoUrls]);
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
          width: { xs: "90%", sm: 700 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: 2,
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
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
              {t("confirmAddition")}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Car Preview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {t("carDetails")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ maxWidth: 600, mx: "auto" }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={car?.photos?.[0] || "/images/products/img1.jpg"}
                    alt={car?.name || t("carName")}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {car?.name || t("carName")}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {car?.model || t("carModel")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {car?.description || t("carDescription")}
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
              {t("additionalDetails")}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label={t("condition")}
                variant="outlined"
                fullWidth
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
              <TextField
                label={t("features")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
              <TextField
                label={t("price")}
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
              {t("photos")}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {photos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo}
                      alt={`${t("carDetails")} ${index + 1}`}
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
                      alt={`${t("photos")} ${index + 1}`}
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
                  border: "1px solid #ccc",
                  padding: "6px 8px",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
              <FormHelperText>{t("selectMultipleFiles")}</FormHelperText>
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
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmAddWithPhotos}
              color="primary"
              variant="contained"
            >
              {t("add")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCarConfirmationModal;
