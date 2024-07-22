import { notFound } from 'next/navigation';
import ClientProvider from './ClientProvider';

const loadMessages = async (locale) => {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    throw new Error('Failed to load messages');
  }
};

const RootLayout = async ({ children, params: { locale } }) => {
  let messages;
  try {
    messages = await loadMessages(locale);
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <ClientProvider locale={locale} messages={messages}>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
