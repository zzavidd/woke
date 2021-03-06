import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { zText } from 'zavid-modules';

import { cloudinary, domain } from 'constants/settings.js';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const meta = await Document.getInitialProps(ctx);
    return { ...meta };
  }

  render() {
    const { query } = this.props.__NEXT_DATA__;

    return (
      <Html>
        <Head>
          <Meta {...query} />
        </Head>
        <body className={'body'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/** Add metadata to each webpage */
const Meta = ({
  title = 'Page Not Found',
  ogUrl = '',
  description = '',
  cardImage = 'public/bg/card-home.jpg'
}) => (
  <React.Fragment>
    {/* Global site tag (gtag.js) - Google Analytics */}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-145389782-1"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-145389782-1');`
      }}
    />

    {/* Page information */}
    <meta charSet="UTF-8" name="author" content="Zavid Egbue" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />

    <title>{title}</title>
    <meta name="description" content={description} />

    {/* OpenGraph meta tags for search engine optimisation */}
    <meta property="og:title" content={title} />
    <meta
      property="og:description"
      content={zText.truncateText(description, { limit: 30 })}
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`${domain}${ogUrl}`} />

    <meta property="og:image" content={`${cloudinary.url}/${cardImage}`} />
    <meta property="og:image:height" content="800" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content={title} />
    <meta property="og:site_name" content="#WOKEWeekly" />
    <meta
      name="google-site-verification"
      content="Kv9Zk269oRFxqqh7W9amnHVXRsR8qREsGK4dk0a1SQk"
    />
    <meta name="twitter:card" content="summary_large_image" />

    {/* Favicon */}
    <link rel="icon" href={`${cloudinary.url}/public/logos/favicon.jpg`} />

    {/* BootStrap and Google Web Fonts importation */}
    <link
      rel="stylesheet"
      type="text/css"
      href="https://fonts.googleapis.com/css?family=Raleway:400,700|Yeseva+One|Patua+One:400,700"
    />
  </React.Fragment>
);
