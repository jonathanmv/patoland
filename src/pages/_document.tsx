import { Head, Html, Main, NextScript } from "next/document";
import TopBar from "~/components/header";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Descubre un mundo de patos" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <main>
          <TopBar />
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  );
}