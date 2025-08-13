export const metadata = {
  title: "Allyship Companion",
  description: "Pause with purpose—reflect, grow, and act with intention."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
