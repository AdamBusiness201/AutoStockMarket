'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { baselightTheme } from '../../utils/theme/DefaultColors';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888; /* Scrollbar thumb color */
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Scrollbar thumb color on hover */
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Scrollbar track color */
  }
`;

const ClientProvider = ({ children, locale, messages }) => {

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider theme={baselightTheme}>
        <CssBaseline />
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default ClientProvider;
