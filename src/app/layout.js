import ReduxProvider from '@/app/redux/provider';

export const metadata = {
  title: 'Yuk, temukan yang kamu butuhkan!',
  description: 'Yuk, temukan yang kamu butuhkan!'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          {/* <Scripts /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
