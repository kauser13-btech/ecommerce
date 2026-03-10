import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/products/${slug}`, {
      next: { tags: ['products', `product-${slug}`] }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categorySlug) {
  if (!categorySlug) return [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/products?category=${categorySlug}&limit=4`, {
      next: { tags: ['products'] }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.short_description || product.name,
    openGraph: {
      images: [product.image],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category?.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://appleians.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://appleians.com/products"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.category?.name || "Category",
                "item": `https://appleians.com/products?category=${product.category?.slug || ''}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": product.name,
                "item": `https://appleians.com/products/${slug}`
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": product.short_description || product.name,
            "offers": {
              "@type": "Offer",
              "url": `https://appleians.com/products/${slug}`,
              "priceCurrency": "BDT",
              "price": product.sale_price || product.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
