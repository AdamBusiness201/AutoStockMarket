'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split("/")[1];
  const changeLanguage = (event) => {
    const newLang = event.target.value;
    router.replace(`/${newLang}`);
  };

  return (
    <div style={{ textAlign: 'right', padding: '10px' }}>
      <select value={lang || 'en'} onChange={changeLanguage}>
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
        <option value="it">Italiano</option>
        <option value="zh-CN">中文</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
