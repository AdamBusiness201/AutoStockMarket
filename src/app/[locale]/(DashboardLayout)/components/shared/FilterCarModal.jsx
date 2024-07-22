import React, { useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const FilterModal = ({ open, handleClose, carData, setFilteredCarData }) => {
    const [filterCriteria, setFilterCriteria] = useState('');

    const handleApplyFilter = () => {
        // Filter the car data based on the filter criteria
        const filteredData = carData.filter((car) =>
            car.carName.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.color.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.model.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.chassisNumber.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.owner.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.by.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.source.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.purchaseDate.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            car.vehicleLocation.toLowerCase().includes(filterCriteria.toLowerCase())
        );
        // Set the filtered car data in the parent component
        setFilteredCarData(filteredData);
        handleClose(); // Close the modal
    };

    const handleResetFilter = () => {
        setFilterCriteria(''); // Reset filter criteria
        setFilteredCarData(carData); // Reset filtered car data to original data
        handleClose(); // Close the modal
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '16px',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Filter Car Data
                </Typography>
                <TextField
                    fullWidth
                    label="Filter Criteria"
                    variant="outlined"
                    value={filterCriteria}
                    onChange={(e) => setFilterCriteria(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" onClick={handleResetFilter}>
                        Reset
                    </Button>
                    <Button variant="contained" onClick={handleApplyFilter}>
                        Apply
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FilterModal;
