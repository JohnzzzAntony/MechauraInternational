import * as React from "react";

interface JsonLdProps {
  type: "organization" | "website" | "product" | "localBusiness" | "custom";
  data?: any;
}

export function JsonLd({ type, data }: JsonLdProps) {
  let schemaData: any = null;

  if (type === "organization") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: data?.name || "Mechaura International FZE LLC",
      alternateName: data?.shortName || "Mechaura International",
      url: "https://mechaurainternational.com",
      logo: "https://mechaurainternational.com/icon.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: data?.phone || "+971 56 620 2517",
        contactType: "customer service",
        email: data?.email || "info@mechaurainternational.com",
        areaServed: ["AE", "SA", "QA", "OM", "KW", "BH"],
        availableLanguage: ["en", "ar"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ajman",
        addressRegion: "Ajman Free Zone",
        addressCountry: "AE",
      },
    };
  } else if (type === "website") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Mechaura International",
      url: "https://mechaurainternational.com",
    };
  } else if (type === "product" && data) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      description: data.shortDescription || data.description,
      image: data.image ? `https://mechaurainternational.com${data.image}` : undefined,
      brand: {
        "@type": "Brand",
        name: data.brands?.[0] || "Mechaura",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "AED",
        availability: "https://schema.org/InStock",
      },
    };
  } else if (type === "custom" && data) {
    try {
      schemaData = typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return null;
    }
  }

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
