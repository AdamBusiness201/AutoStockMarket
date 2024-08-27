'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Box, MenuItem, Select, InputLabel, FormControl, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import Flag from 'react-world-flags';

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split("/")[1] || 'en';

  const changeLanguage = (event) => {
    const newLang = event.target.value;
    // Update the locale while preserving the rest of the path
    const newPathname = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPathname);
  };

  const languages = [
    { code: 'en', name: 'English', flag: 'US' },
    { code: 'ar', name: 'العربية', flag: 'SA' },
  ];

  const StyledSelect = styled(Select)({
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
  });

  return (
    <Box sx={{ textAlign: 'start', width: "100%" }}>
      <FormControl variant="outlined" sx={{ width: "100%"}}>
        <InputLabel id="language-selector-label">Language</InputLabel>
        <StyledSelect
          labelId="language-selector-label"
          value={lang}
          onChange={changeLanguage}
          label="Language"
        >
          {languages.map(({ code, name, flag }) => (
            <MenuItem key={code} value={code}>
              <ListItemIcon>
                <Flag code={flag} style={{ width: 24, height: 24, marginRight: 8 }} />
              </ListItemIcon>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
