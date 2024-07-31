import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const ClearableTextField = ({ value, onChange, label, name, ...props }) => {
  const handleReset = () => {
    onChange({ target: { name, value: '' } });
  };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={handleReset}>
              <Close />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default ClearableTextField;
