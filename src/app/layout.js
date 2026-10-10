import "./globals.css";
import Header from "../components/header";

export const metadata = {
  title: "Bazar Dor | বাজার দর",
  description:
    "নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন এবং পরিকল্পনা করে বাজার করুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Header />
        {children}

        <footer className="site-footer">
          <p>
            <strong>Bazar Dor</strong> — সহজে বাজারের দাম যাচাই করুন।
          </p>
          <p>
            © {new Date().getFullYear()} Bazar Dor. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}