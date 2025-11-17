import { Product, ProductVariant, RoomCategory } from './types';

// WARNING: Storing API keys in frontend code is a major security risk.
// These keys will be visible to anyone inspecting your website's code.
// This is for demonstration purposes only. For a production application,
// these keys should be handled by a secure backend server.
const WOOCOMMERCE_URL = 'https://cms.roberts.co.ke'; // <-- IMPORTANT: REPLACE WITH YOUR WORDPRESS URL
const CONSUMER_KEY = 'ck_de24f6c41a6ec9d98b07a841c167648a8980ea13';
const CONSUMER_SECRET = 'cs_deddfee785450cc9f8666d36d075202c88dbcf61';

// Helper function to strip HTML tags from descriptions
const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// Maps a WooCommerce product object to our app's Product type
const mapWooProductToAppProduct = (wooProduct: any): Product => {
  if (!wooProduct || typeof wooProduct !== 'object') {
    throw new Error("Invalid product data received from API.");
  }

  const regularPrice = parseFloat(wooProduct.regular_price);
  const salePrice = parseFloat(wooProduct.sale_price);

  const validRegularPrice = isNaN(regularPrice) ? 0 : regularPrice;
  const validSalePrice = isNaN(salePrice) ? 0 : salePrice;

  const onSale = wooProduct.on_sale && validSalePrice > 0 && validSalePrice < validRegularPrice;

  let saleConfig;
  if (onSale) {
    saleConfig = {
      discount: (validRegularPrice - validSalePrice) / validRegularPrice
    };
  }

  // Safely map images, ensuring every element is valid
  const images = Array.isArray(wooProduct.images)
    ? wooProduct.images
        .map((img: any) => (img && typeof img.src === 'string' ? img.src : null))
        .filter((src: string | null): src is string => src !== null)
    : [];

  // Simplified variant mapping. Assumes first image is for the variant.
  const variants: ProductVariant[] = [{
    color: '#CCCCCC', // Default color
    colorName: 'Default',
    images: images,
    stock: wooProduct.stock_quantity ?? (wooProduct.in_stock ? 100 : 0),
  }];

  const categoryName = (Array.isArray(wooProduct.categories) && wooProduct.categories[0] && wooProduct.categories[0].name)
    ? wooProduct.categories[0].name
    : 'Uncategorized';

  return {
    id: wooProduct.id,
    name: wooProduct.name || 'Untitled Product',
    category: categoryName,
    subCategory: categoryName,
    price: validRegularPrice,
    originalPrice: onSale ? validRegularPrice : undefined,
    rating: parseFloat(wooProduct.average_rating) || 0,
    reviewCount: wooProduct.rating_count || 0,
    variants: variants,
    description: stripHtml(wooProduct.description || wooProduct.short_description),
    status: wooProduct.status === 'publish' ? 'published' : 'pending',
    // These fields are not standard in WooCommerce, providing defaults
    creatorId: '+15557654321', // Default creator
    creatorName: 'Roberts Indoor Solutions',
    dateAdded: (wooProduct.date_created_gmt || new Date().toISOString().replace('Z', '')) + 'Z',
    salesCount: wooProduct.total_sales || 0,
    reviews: [], // Reviews need a separate API call, keeping it simple for now
    sale: saleConfig,
    // Pre-order logic would need to be based on a tag or category in WooCommerce.
    preOrder: undefined, 
  };
};

// Maps a WooCommerce category object to our app's RoomCategory type
const mapWooCategoryToRoomCategory = (wooCategory: any): RoomCategory => {
  if (!wooCategory || typeof wooCategory !== 'object') {
    throw new Error("Invalid category data received from API.");
  }
  
  const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format=fit=crop';
  // FIX: Changed wooProduct to wooCategory to correctly reference the function parameter.
  const imageUrl = (wooCategory.image && typeof wooCategory.image.src === 'string') ? wooCategory.image.src : defaultImage;
  const name = wooCategory.name || 'Uncategorized';

  return {
    id: wooCategory.id,
    name: name,
    description: stripHtml(wooCategory.description) || `Explore our collection of ${name}.`,
    imageUrl: imageUrl,
    subCategories: ['All'], // Simplified for now. A real implementation could fetch child categories.
    hero: {
      title: name,
      subtitle: stripHtml(wooCategory.description) || `Discover our curated selection for your ${name}.`,
      imageUrl: imageUrl,
    },
    // Add a default theme
    theme: {
        bgClass: 'bg-stone-50',
        primaryText: 'text-stone-900',
        buttonBg: 'bg-stone-800'
    } 
  };
};

interface FetchProductsParams {
    perPage?: number;
    orderBy?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
    order?: 'asc' | 'desc';
    offset?: number;
}

export const fetchProducts = async (params: FetchProductsParams = {}): Promise<Product[]> => {
  const { perPage = 100, orderBy = 'date', order = 'desc', offset } = params;
  try {
    const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        orderby: orderBy,
        order: order,
    });

    if (offset) {
        queryParams.append('offset', offset.toString());
    }
    
    const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?${queryParams.toString()}`;
    
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
    
    return wooProducts
      .map((p: any) => {
        try {
          return mapWooProductToAppProduct(p);
        } catch (e) {
          console.warn("Skipping a product due to mapping error:", e, p);
          return null;
        }
      })
      .filter((p): p is Product => p !== null);

  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

export const fetchCategories = async (): Promise<RoomCategory[]> => {
    try {
        const queryParams = new URLSearchParams({
            per_page: '100', // Fetch up to 100 categories
            parent: '0', // Fetch only top-level categories
            hide_empty: 'true', // Hide categories with no products
        });

        const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?${queryParams.toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));

        const response = await fetch(proxyUrl, { headers });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(`Failed to fetch categories. Status: ${response.status} ${response.statusText}`);
            }
            console.error('WooCommerce API Error:', errorData);
            throw new Error(`Failed to fetch categories: ${errorData.message || response.statusText}`);
        }

        const wooCategories = await response.json();
        if (!Array.isArray(wooCategories)) {
            console.error('Expected an array of categories, but got:', wooCategories);
            return [];
        }

        // Filter out "Uncategorized" category which is default in WooCommerce
        const filteredCategories = wooCategories.filter(cat => cat && cat.slug !== 'uncategorized');
        
        return filteredCategories
          .map((c: any) => {
            try {
              return mapWooCategoryToRoomCategory(c);
            } catch (e) {
              console.warn("Skipping a category due to mapping error:", e, c);
              return null;
            }
          })
          .filter((c): c is RoomCategory => c !== null);
          
    } catch (error) {
        console.error('Error fetching categories from WooCommerce:', error);
        throw error;
    }
};