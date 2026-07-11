import { useEffect } from 'react';

const SITE_URL = 'https://www.secondthriftt.com';
const SITE_NAME = 'Second Thrift';
const DEFAULT_DESCRIPTION = 'Second Thrift — Premium vintage & designer thrift clothing curated in India for European style lovers. Discover unique vintage, designer, and bulk deals with shipping to Europe.';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

/**
 * useSEO — dynamically sets document title, meta description, canonical,
 * Open Graph, and Twitter Card tags for each page.
 */
export const useSEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    path = '',
    image = DEFAULT_IMAGE,
    type = 'website',
    noindex = false,
} = {}) => {
    useEffect(() => {
        let fullTitle = '';
        if (title) {
            if (title.includes(SITE_NAME) || title.includes('SecondThriftt')) {
                fullTitle = title;
            } else {
                fullTitle = `${title} | ${SITE_NAME}`;
            }
        } else {
            fullTitle = `${SITE_NAME} (SecondThriftt) — Premium Vintage & Designer Streetwear`;
        }
        const canonicalUrl = `${SITE_URL}${path}`;

        // Title
        document.title = fullTitle;

        // Helper to set or create a meta tag
        const setMeta = (attr, key, value) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        // Meta description
        setMeta('name', 'description', description);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalUrl);

        // Robots
        if (noindex) {
            setMeta('name', 'robots', 'noindex, nofollow');
        } else {
            let robotsMeta = document.querySelector('meta[name="robots"]');
            if (robotsMeta) robotsMeta.remove();
        }

        // Open Graph
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:url', canonicalUrl);
        setMeta('property', 'og:image', image);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:site_name', SITE_NAME);
        setMeta('property', 'og:locale', 'en_US');

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', image);

        return () => {
            // Cleanup is not strictly needed since we update on each page
        };
    }, [title, description, path, image, type, noindex]);
};

/**
 * Organization Schema — establishes brand entity with all name variations
 * so Google understands "Second Thrift", "SecondThrift", "Second Thriftt" etc. are the same brand.
 */
export const organizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Second Thrift',
    alternateName: [
        'SecondThrift',
        'Second Thriftt',
        'SecondThriftt',
        'second thrift',
        'secondthrift',
        'second thriftt',
        'secondthriftt',
        'SecondThirft',
        'SecondThiftt',
        'SecondThirftt',
    ],
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    email: 'secondthriftt39@gmail.com',
    telephone: '+919909527515',
    sameAs: [
        'https://www.instagram.com/second._.thriftt',
        'https://www.youtube.com/@secondthriftt',
        'https://facebook.com/secondthrift',
        'https://tiktok.com/@secondthrift',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+919909527515',
        contactType: 'customer service',
        email: 'secondthriftt39@gmail.com',
        availableLanguage: ['English', 'Hindi', 'German'],
    },
    foundingDate: '2024',
    areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 48.2082,
            longitude: 16.3738,
        },
        geoRadius: '5000',
    },
});

/**
 * WebSite Schema — enables sitelinks searchbox in Google results
 */
export const websiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ['SecondThrift', 'Second Thriftt', 'SecondThriftt'],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en',
});

/**
 * BreadcrumbList Schema
 */
export const breadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
});

/**
 * Product Schema — for individual product pages
 */
export const productSchema = (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — Premium pre-loved fashion from Second Thrift`,
    image: product.images?.[0] || DEFAULT_IMAGE,
    brand: {
        '@type': 'Brand',
        name: product.brand || 'Second Thrift',
    },
    offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/product/${product.id}`,
        priceCurrency: 'EUR',
        price: product.price,
        availability: product.inStock !== false
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: { '@id': `${SITE_URL}/#organization` },
        itemCondition: product.condition === 'new'
            ? 'https://schema.org/NewCondition'
            : 'https://schema.org/UsedCondition',
    },
    category: product.category || 'Clothing',
});

/**
 * FAQ Schema — for FAQ sections
 */
export const faqSchema = (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q || faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a || faq.answer,
        },
    })),
});

/**
 * JsonLd component — injects a JSON-LD script into the page head
 */
export const JsonLd = ({ data }) => {
    useEffect(() => {
        if (!data) return;

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [data]);

    return null;
};
