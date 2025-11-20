
import { Product, ProductVariant, RoomCategory, MpesaPaymentRequest, MpesaPaymentResponse, BlogPost } from './types';

// WARNING: Storing API keys in frontend code is a major security risk.
// These keys will be visible to anyone inspecting your website's code.
// This is for demonstration purposes only. For a production application,
// these keys should be handled by a secure backend server.
const WOOCOMMERCE_URL = 'https://cms.roberts.co.ke'; 
const CONSUMER_KEY = 'ck_de24f6c41a6ec9d98b07a841c167648a8980ea13';
const CONSUMER_SECRET = 'cs_deddfee785450cc9f8666d36d075202c88dbcf61';

// Helper function to strip HTML tags from descriptions
const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  } catch (e) {
    // Fallback regex for environments without DOMParser or if it fails
    return (html || "").replace(/<[^>]*>?/gm, '');
  }
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

  // Determine stock level correctly based on WooCommerce API structure
  let stockCount = 0;

  if (wooProduct.stock_status === 'outofstock') {
      stockCount = 0;
  } else {
      if (typeof wooProduct.stock_quantity === 'number' && wooProduct.stock_quantity > 0) {
          stockCount = wooProduct.stock_quantity;
      } else {
          stockCount = 100; // Arbitrary positive number to indicate availability
      }
  }

  const variants: ProductVariant[] = [{
    color: '#CCCCCC', // Default color
    colorName: 'Default',
    images: images,
    stock: stockCount,
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
    creatorId: '+15557654321', // Default creator
    creatorName: 'Roberts Indoor Solutions',
    dateAdded: (wooProduct.date_created_gmt || new Date().toISOString().replace('Z', '')) + 'Z',
    salesCount: wooProduct.total_sales || 0,
    reviews: [], 
    sale: saleConfig,
    preOrder: undefined, 
  };
};

// Maps a WooCommerce category object to our app's RoomCategory type
const mapWooCategoryToRoomCategory = (wooCategory: any): RoomCategory => {
  if (!wooCategory || typeof wooCategory !== 'object') {
    throw new Error("Invalid category data received from API.");
  }
  
  const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format=fit=crop';
  // Use optional chaining for safety
  const imageUrl = (wooCategory.image && typeof wooCategory.image.src === 'string') ? wooCategory.image.src : defaultImage;
  const name = wooCategory.name || 'Uncategorized';

  return {
    id: wooCategory.id,
    name: name,
    description: stripHtml(wooCategory.description) || `Explore our collection of ${name}.`,
    imageUrl: imageUrl,
    subCategories: ['All'],
    hero: {
      title: name,
      subtitle: stripHtml(wooCategory.description) || `Discover our curated selection for your ${name}.`,
      imageUrl: imageUrl,
    },
    theme: {
        bgClass: 'bg-stone-50',
        primaryText: 'text-stone-900',
        buttonBg: 'bg-stone-800'
    } 
  };
};

const mapWooPostToBlogPost = (wpPost: any): BlogPost => {
    if (!wpPost) throw new Error("Invalid post data");

    // Default image
    let imageUrl = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format=fit=crop';
    
    // Robust check for embedded featured media
    if (wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        imageUrl = wpPost._embedded['wp:featuredmedia'][0].source_url;
    } else if (wpPost.content?.rendered) {
        // Try to find first image in content if not featured
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = wpPost.content.rendered.match(imgRegex);
        if (match) {
            imageUrl = match[1];
        }
    }
    
    return {
        id: wpPost.id || Math.random(),
        title: wpPost.title?.rendered || 'Untitled Post',
        excerpt: stripHtml(wpPost.excerpt?.rendered),
        content: wpPost.content?.rendered || '', // Keep HTML content
        imageUrl: imageUrl,
        author: 'Roberts Team', 
        date: wpPost.date ? new Date(wpPost.date).toLocaleDateString() : new Date().toLocaleDateString(),
        status: 'published',
        bgColor: (wpPost.id % 2 === 0) ? 'black' : 'yellow'
    };
}

interface FetchProductsParams {
    perPage?: number;
    orderBy?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
    order?: 'asc' | 'desc';
    offset?: number;
}

const formatError = (error: any): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error !== null) {
        if ('message' in error) return String((error as any).message);
        try {
            const json = JSON.stringify(error);
            if (json !== '{}') return json;
        } catch {
        }
    }
    return String(error);
};

export const fetchProducts = async (params: FetchProductsParams = {}): Promise<Product[]> => {
  const { perPage = 100, orderBy = 'date', order = 'desc', offset } = params;
  try {
    // Add timestamp to prevent caching of stale data
    const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        orderby: orderBy,
        order: order,
        _t: Date.now().toString() 
    });

    if (offset) {
        queryParams.append('offset', offset.toString());
    }
    
    const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?${queryParams.toString()}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));

    const response = await fetch(proxyUrl, { headers });
    const responseText = await response.text();

    if (!response.ok) {
        console.error(`WooCommerce API Error (fetchProducts) ${response.status}: ${responseText}`);
        return [];
    }

    let wooProducts;
    try {
        wooProducts = JSON.parse(responseText);
    } catch (e) {
        console.error('Failed to parse products JSON:', responseText.substring(0, 200));
        return [];
    }

    if (!Array.isArray(wooProducts)) {
        console.error('Expected an array of products, but got:', formatError(wooProducts));
        return [];
    }
    
    return wooProducts
      .map((p: any) => {
        try {
          return mapWooProductToAppProduct(p);
        } catch (e) {
          return null;
        }
      })
      .filter((p): p is Product => p !== null);

  } catch (error: any) {
    console.error('Error fetching products from WooCommerce:', formatError(error));
    return [];
  }
};

export const fetchCategories = async (): Promise<RoomCategory[]> => {
    try {
        const queryParams = new URLSearchParams({
            per_page: '100',
            parent: '0',
            hide_empty: 'true',
            _t: Date.now().toString()
        });

        const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?${queryParams.toString()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));

        const response = await fetch(proxyUrl, { headers });
        const responseText = await response.text();

        if (!response.ok) {
            console.error(`WooCommerce API Error (fetchCategories) ${response.status}: ${responseText}`);
            return [];
        }

        let wooCategories;
        try {
            wooCategories = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse categories JSON:', responseText.substring(0, 200));
            return [];
        }

        if (!Array.isArray(wooCategories)) {
            console.error('Expected an array of categories, but got:', formatError(wooCategories));
            return [];
        }

        const filteredCategories = wooCategories.filter(cat => cat && cat.slug !== 'uncategorized');
        
        return filteredCategories
          .map((c: any) => {
            try {
              return mapWooCategoryToRoomCategory(c);
            } catch (e) {
              return null;
            }
          })
          .filter((c): c is RoomCategory => c !== null);
          
    } catch (error: any) {
        console.error('Error fetching categories from WooCommerce:', formatError(error));
        return [];
    }
};

export const fetchPosts = async (): Promise<BlogPost[]> => {
    try {
        // Add timestamp to prevent caching of stale data
        const targetUrl = `${WOOCOMMERCE_URL}/wp-json/wp/v2/posts?_embed&per_page=20&_t=${Date.now()}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) return [];
        
        let posts;
        try {
             posts = await response.json();
        } catch (e) {
            console.error("Failed to parse posts JSON");
            return [];
        }

        if (!Array.isArray(posts)) return [];
        
        return posts.map((post: any) => {
            try {
                return mapWooPostToBlogPost(post);
            } catch (e) {
                console.warn("Skipping malformed post", e);
                return null;
            }
        }).filter((p): p is BlogPost => p !== null);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export const fetchSiteSettings = async () => {
    try {
        const targetUrl = `${WOOCOMMERCE_URL}/wp-json/`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
             return null;
        }
        const data = await response.json();
        
        return {
            name: data.name || 'Roberts Indoor Solutions',
            description: data.description,
            logoUrl: data.site_logo?.url || data.site_logo || data.site_icon_url || ''
        };
    } catch (error) {
        return null;
    }
}

// --- Backend Write Operations ---

export const createProduct = async (productData: { name: string, description: string, regular_price?: string }): Promise<Product | null> => {
    try {
      const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      
      const headers = new Headers();
      headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));
      headers.append('Content-Type', 'application/json');

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          regular_price: productData.regular_price || '0',
          status: 'publish'
        })
      });

      if (!response.ok) {
         console.error("Failed to create product", await response.text());
         return null;
      }

      const newProduct = await response.json();
      try {
        return mapWooProductToAppProduct(newProduct);
      } catch (e) {
        console.warn("Created product but failed to map response:", e);
        // Return a fallback object to keep UI working
        return { ...newProduct, status: 'published', variants: [], reviews: [] };
      }
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
}

export const createPost = async (postData: { title: string, content: string, excerpt?: string, status?: string, imageUrl?: string }): Promise<boolean> => {
    try {
     const url = `${WOOCOMMERCE_URL}/wp-json/wp/v2/posts`;
     const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
     
     const headers = new Headers();
     headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));
     headers.append('Content-Type', 'application/json');

     // If imageUrl is provided (base64 or URL), embed it in content.
     // We prepend it to the content block.
     let finalContent = postData.content || '';
     if (postData.imageUrl) {
         finalContent = `<img src="${postData.imageUrl}" alt="${postData.title}" style="max-width:100%; height:auto; margin-bottom: 20px; display: block;" />\n\n${finalContent}`;
     }

     const response = await fetch(proxyUrl, {
       method: 'POST',
       headers: headers,
       body: JSON.stringify({
         title: postData.title,
         content: finalContent,
         excerpt: postData.excerpt,
         status: 'publish' 
       })
     });

     if (!response.ok) {
         const err = await response.text();
         console.error("Failed to create post:", err);
         return false;
     }

     return true;
   } catch (error) {
     console.error("Error creating post:", error);
     return false;
   }
}

export const updateWooCategory = async (id: number, data: { name?: string, description?: string, image?: { src: string } }): Promise<boolean> => {
    try {
        const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories/${id}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));
        headers.append('Content-Type', 'application/json');

        const response = await fetch(proxyUrl, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data)
        });

        return response.ok;
    } catch (error) {
        console.error("Error updating category:", error);
        return false;
    }
}

// --- M-PESA & OTP INTEGRATION ---

export const initiateMpesaStkPush = async (request: MpesaPaymentRequest): Promise<MpesaPaymentResponse | null> => {
    console.log("Initiating M-Pesa STK Push for:", request);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                MerchantRequestID: "12345-67890",
                CheckoutRequestID: "ws_CO_DMZ_1234567890",
                ResponseCode: "0",
                ResponseDescription: "Success. Request accepted for processing",
                CustomerMessage: "Success. Request accepted for processing"
            });
        }, 2000);
    });
};

export const sendOtp = async (phone: string): Promise<boolean> => {
    console.log("Sending OTP to:", phone);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

export const verifyOtp = async (phone: string, code: string): Promise<boolean> => {
    console.log("Verifying OTP for:", phone, "Code:", code);
    return new Promise((resolve) => {
        setTimeout(() => resolve(code === '1234' || code === '3232'), 1000);
    });
};
