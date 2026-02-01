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
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
