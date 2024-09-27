import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

const pretendard = {
  variable: "--font-pretendard",
  className: "font-pretendard",
};

export const metadata: Metadata = {
  title: "명품 패션 직구 가격비교 | 럭셔리 디스팟",
  description:
    "럭셔리 디스팟은 명품 패션 애호가를 위한 최고의 가격비교 플랫폼입니다. 국내외 유명 럭셔리 브랜드의 제품을 한눈에 비교하고, 해외 직구를 통해 최저가로 구매할 수 있습니다. 다양한 명품 패션 아이템의 실시간 가격 정보와 직구 팁을 제공하여, 스마트한 럭셔리 쇼핑을 도와드립니다. 럭셔리 디스팟과 함께라면, 합리적인 가격으로 당신의 스타일을 완성할 수 있습니다.",
  openGraph: {
    title: "명품 패션 직구 가격비교 | 럭셔리 디스팟",
    description:
      "럭셔리 디스팟은 명품 패션 애호가를 위한 최고의 가격비교 플랫폼입니다. 국내외 유명 럭셔리 브랜드의 제품을 한눈에 비교하고, 해외 직구를 통해 최저가로 구매할 수 있습니다. 다양한 명품 패션 아이템의 실시간 가격 정보와 직구 팁을 제공하여, 스마트한 럭셔리 쇼핑을 도와드립니다. 럭셔리 디스팟과 함께라면, 합리적인 가격으로 당신의 스타일을 완성할 수 있습니다.",
    url: "https://luxurydispot.com/",
    siteName: "명품 패션 직구 가격비교 | 럭셔리 디스팟",
    images: [
      {
        url: "https://gvzpgksrsvrwzawlqdzz.supabase.co/storage/v1/object/public/image/meta/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "명품 패션 직구 가격비교 | 럭셔리 디스팟",
    description:
      "럭셔리 디스팟은 명품 패션 애호가를 위한 최고의 가격비교 플랫폼입니다. 국내외 유명 럭셔리 브랜드의 제품을 한눈에 비교하고, 해외 직구를 통해 최저가로 구매할 수 있습니다. 다양한 명품 패션 아이템의 실시간 가격 정보와 직구 팁을 제공하여, 스마트한 럭셔리 쇼핑을 도와드립니다. 럭셔리 디스팟과 함께라면, 합리적인 가격으로 당신의 스타일을 완성할 수 있습니다.",
    images: [
      "https://gvzpgksrsvrwzawlqdzz.supabase.co/storage/v1/object/public/image/meta/og-image.png",
    ],
  },
  keywords: [
    "명품 패션",
    "럭셔리 브랜드",
    "해외 직구",
    "가격비교",
    "럭셔리 디스팟",
    "패션 직구",
    "명품 가격비교",
    "럭셔리 쇼핑",
    "해외 명품",
    "직구 팁",
    "최저가 명품",
    "명품 쇼핑몰",
    "패션 트렌드",
    "프리미엄 브랜드",
    "스마트 쇼핑",
  ],
  authors: [{ name: "DISPOT" }],
  creator: "DISPOT",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://luxurydispot.com/",
  },
  publisher: "DISPOT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HCN86CD6JL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HCN86CD6JL');
          `}
        </Script>
        <meta
          name="naver-site-verification"
          content="6033dd849f8801ffcdc2f72dc3206e0fb1c16627"
        />
      </head>
      <body
        className={`${pretendard.className} antialiased bg-gray-200 min-h-screen`}
      >
        <div className="max-w-[500px] mx-auto bg-white min-h-screen shadow-md relative pb-16">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
