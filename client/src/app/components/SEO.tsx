import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
};

function ensureMeta(name: string, attribute: "name" | "property") {
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  return element;
}

export default function SEO({ title, description, keywords, image }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Success Academy`;
    document.title = fullTitle;

    ensureMeta("description", "name").content = description;
    ensureMeta("keywords", "name").content =
      keywords ??
      "Success Academy, nursery school, primary school, secondary school, admissions, academics, Lagos school";
    ensureMeta("og:title", "property").content = fullTitle;
    ensureMeta("og:description", "property").content = description;
    ensureMeta("og:type", "property").content = "website";
    ensureMeta("og:url", "property").content = window.location.href;
    ensureMeta("twitter:card", "name").content = "summary_large_image";
    ensureMeta("twitter:title", "name").content = fullTitle;
    ensureMeta("twitter:description", "name").content = description;

    if (image) {
      ensureMeta("og:image", "property").content = image;
      ensureMeta("twitter:image", "name").content = image;
    }
  }, [description, image, keywords, title]);

  return null;
}
