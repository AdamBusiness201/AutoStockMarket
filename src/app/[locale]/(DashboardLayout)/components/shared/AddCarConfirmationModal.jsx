import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const AddCarConfirmationModal = ({ open, handleClose, car, handleConfirmAdd }) => {
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
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 5,
        }}
      >
        <Typography
          id="add-car-confirmation-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Confirm Addition
        </Typography>
        <Typography
          id="add-car-confirmation-description"
          variant="body1"
          component="div"
          gutterBottom
        >
          Are you sure you want to add {car?.name} {car?.model} to the e-commerce site?
        </Typography>
        <Box textAlign="right">
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAdd}
            color="success"
            variant="outlined"
          >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCarConfirmationModal;
