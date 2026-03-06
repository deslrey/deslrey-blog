import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  canonical,
  structuredData,
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    const currentUrl = url || window.location.href;

    // Basic Meta
    if (description) setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // Open Graph
    if (title) setMeta("og:title", title, "property");
    if (description) setMeta("og:description", description, "property");
    setMeta("og:url", currentUrl, "property");
    setMeta("og:type", type, "property");
    if (image) setMeta("og:image", image, "property");

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    if (title) setMeta("twitter:title", title);
    if (description) setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    const canonicalUrl = canonical || currentUrl;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonicalUrl);

    let scriptJsonLd: HTMLScriptElement | null = null;
    if (structuredData) {
      scriptJsonLd = document.getElementById("structured-data") as HTMLScriptElement | null;
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement("script");
        scriptJsonLd.id = "structured-data";
        scriptJsonLd.type = "application/ld+json";
        document.head.appendChild(scriptJsonLd);
      }
      scriptJsonLd.innerHTML = JSON.stringify(structuredData);
    }

    return () => {
      const ld = document.getElementById("structured-data");
      if (ld) ld.remove();
    };
  }, [title, description, keywords, image, url, type, canonical, structuredData]);

  return null;
};

export default SEO;
