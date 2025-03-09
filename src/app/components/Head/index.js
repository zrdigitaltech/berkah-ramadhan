import Head from 'next/head';
import { Fragment } from 'react';

const Index = (props) => {
  const { title, description, author, keywords, themeColor, manifest, url, image } = props;

  return (
    <Fragment>
      <Head>
        {/* Page Title */}
        <title>{title}</title>

        {/* Basic metas */}
        <meta name="description" content={description} />
        <meta name="author" content={author} />
        <meta name="keywords" content={keywords} />
        <meta name="theme-color" content={themeColor} />
        <link rel="manifest" href={manifest} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"></link>

        {/* Facebook Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content={title} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta property="twitter:image:alt" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
    </Fragment>
  );
};

export default Index;
