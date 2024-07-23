'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Box, FormControl, MenuItem, Select, InputLabel } from '@mui/material';

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split("/")[1];
  const changeLanguage = (event) => {
    const newLang = event.target.value;
    router.replace(`/${newLang}`);
  };

  return (
    <Box sx={{ textAlign: 'start', padding: '10px' }}>
      <FormControl variant="outlined" size="large" sx={{ minWidth: 200 }}>
        <InputLabel id="language-selector-label">Language</InputLabel>
        <Select
          labelId="language-selector-label"
          value={lang || 'en'}
          onChange={changeLanguage}
          label="Language"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="it">Italiano</MenuItem>
          <MenuItem value="zh-CN">中文</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
