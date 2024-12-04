import {Html, Head, Main, NextScript} from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`
            }}
          />
        )}
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js.hs-scripts.com/5414449.js"
        />
        <meta charSet="utf-8" />

        <link
          rel="icon"
          href="https://dd35enz0yg5mz.cloudfront.net//static/fnsite/img/favicon3.png"
          type="image/png"
        />
        <script
          src={`https://cdn.tiny.cloud/1/${
            process.env.NEXT_PUBLIC_TINY_MCE_API ?? ''
          }/tinymce/6/tinymce.min.js`}
          referrerPolicy="origin"
        ></script>
        <script
          async
          defer
          src={`//js.hs-scripts.com/5414449.js`}
          referrerPolicy="origin"
        ></script>
      </Head>
      <body className="mainBodyContainer">
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }}
          />
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
