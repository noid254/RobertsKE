import { Product, ProductVariant } from './types';

// WARNING: Storing API keys in frontend code is a major security risk.
// These keys will be visible to anyone inspecting your website's code.
// This is for demonstration purposes only. For a production application,
// these keys should be handled by a secure backend server.
const WOOCOMMERCE_URL = 'https://cms.roberts.co.ke'; // <-- IMPORTANT: REPLACE WITH YOUR WORDPRESS URL
const CONSUMER_KEY = 'ck_de24f6c41a6ec9d98b07a841c167648a8980ea13';
const CONSUMER_SECRET = 'cs_deddfee785450cc9f8666d36d075202c88dbcf61';

// Helper function to strip HTML tags from descriptions
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// Maps a WooCommerce product object to our app's Product type
const mapWooProductToAppProduct = (wooProduct: any): Product => {
  const salePrice = parseFloat(wooProduct.sale_price);
  const regularPrice = parseFloat(wooProduct.regular_price) || 0;
  const onSale = wooProduct.on_sale;

  let saleConfig;
  if (onSale && salePrice < regularPrice) {
    saleConfig = {
      discount: (regularPrice - salePrice) / regularPrice
    };
  }

  // Simplified variant mapping. Assumes first image is for the variant.
  // A real implementation would need to handle WooCommerce product variations API.
  const variants: ProductVariant[] = [{
    color: '#CCCCCC', // Default color
    colorName: 'Default',
    images: wooProduct.images.map((img: any) => img.src),
    stock: wooProduct.stock_quantity ?? (wooProduct.in_stock ? 100 : 0),
  }];

  return {
    id: wooProduct.id,
    name: wooProduct.name,
    category: wooProduct.categories[0]?.name || 'Uncategorized',
    subCategory: wooProduct.categories[0]?.name || 'Uncategorized',
    price: regularPrice,
    originalPrice: onSale ? regularPrice : undefined,
    rating: parseFloat(wooProduct.average_rating),
    reviewCount: wooProduct.rating_count,
    variants: variants,
    description: stripHtml(wooProduct.description || wooProduct.short_description),
    status: wooProduct.status === 'publish' ? 'published' : 'pending',
    // These fields are not standard in WooCommerce, providing defaults
    creatorId: '+15557654321', // Default creator
    creatorName: 'Roberts Indoor Solutions',
    dateAdded: wooProduct.date_created_gmt + 'Z',
    salesCount: wooProduct.total_sales,
    reviews: [], // Reviews need a separate API call, keeping it simple for now
    sale: saleConfig,
    // Pre-order logic would need to be based on a tag or category in WooCommerce.
    preOrder: undefined, 
  };
};

interface FetchProductsParams {
    perPage?: number;
    orderBy?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
    order?: 'asc' | 'desc';
}

export const fetchProducts = async (params: FetchProductsParams = {}): Promise<Product[]> => {
  const { perPage = 100, orderBy = 'date', order = 'desc' } = params;
  try {
    const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        orderby: orderBy,
        order: order,
    }).toString();
    
    const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?${queryParams}`;
    
    // Using a public CORS proxy.
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const headers = new Headers();
    // Use Basic Auth with consumer key as username and secret as password.
    headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));

    const response = await fetch(proxyUrl, { headers });
    
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(`Failed to fetch products. Status: ${response.status} ${response.statusText}`);
        }
        console.error('WooCommerce API Error:', errorData);
        throw new Error(`Failed to fetch products: ${errorData.message || response.statusText}`);
    }

    const wooProducts = await response.json();
    if (!Array.isArray(wooProducts)) {
        console.error('Expected an array of products, but got:', wooProducts);
        return [];
    }
    
    return wooProducts.map(mapWooProductToAppProduct);
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};