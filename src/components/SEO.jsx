import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ekenobizi Voice";
const SITE_URL = "https://ekenobizi-voice.vercel.app";
const DEFAULT_DESCRIPTION =
  "Ekenobizi Voice is the community blog for Ekenobizi in Umuahia, Abia State — sharing stories, news, and voices from our five villages.";
const DEFAULT_IMAGE = `${SITE_URL}/hero.jpg`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  article = null,
}) {
  const fullTitle = title ? `${title} – ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific (PostPage only) */}
      {article?.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
        />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.category && (
        <meta property="article:section" content={article.category} />
      )}
    </Helmet>
  );
}
