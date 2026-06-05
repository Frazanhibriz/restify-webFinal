import Script from "next/script";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script 
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Le_NQktAAAAACGSaQhC9_rMYdzrbIzw1ylEbLBW'}`} 
        strategy="afterInteractive" 
      />

      {children}
    </>
  );
}
