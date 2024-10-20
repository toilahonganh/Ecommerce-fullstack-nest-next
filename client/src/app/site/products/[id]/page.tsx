"use client";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notifyToastError, notifyToastSuccess } from '@/app/utils/NotifyToast';
import styles from "./ProductDetail.module.scss";

interface Product {
  images: string[];
  name: string;
  category: string;
  price: number;
  description: string;
  color: string[];
  size: string[]; // Added size property
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const [authData, setAuthData] = useState<any>(null);
  // const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const [product, setProduct] = useState<Product>({
    images: [],
    name: '',
    category: '',
    price: 0,
    description: '',
    color: [],
    size: [], // Đặt size là một mảng
  });

  const handleColorChange = (color: string) => {
    setProduct((prev: any) => {
      const isSelected = prev.color.includes(color);
      return {
        ...prev,
        color: [color], // Cập nhật màu được chọn
      };
    });
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity(prev => {
      if (type === "increase") return prev + 1;
      if (type === "decrease" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleSizeChange = (size: string) => {
    setProduct((prev: Product | null) => {
      if (!prev) return null;
      return {
        ...prev,
        size: prev.size.includes(size) ? [] : [size], // Toggle size selection
      };
    });
  };

  const handleAddCart = async (userId: string, productId: string, color: string[], size: string, quantity: number) => {
    if (!userId) {
      notifyToastError('Please login to add products to the cart.');
      return;
    }

    if (!size) {
      notifyToastError('Please select a size.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/cart`, {
        user_id: userId,
        product_id: productId,
        size: size,
        color: color,
        quantity,
      });

      setCartItems((prevItems) => [
        ...prevItems,
        {
          productId,
          size,
          color,
          quantity,
          productDetails: product,
        }
      ]);
      notifyToastSuccess(`Added successfully ${product?.name}`);
    } catch (error) {
      notifyToastError('Error adding product to the cart');
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product/${id}`);
          console.log("Fetched product:", response.data);
          setProduct(response.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div>
      <div className={styles.product_details}>
        <div className={styles.product_images}>
          <div className={styles.product_images_row}>
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} image ${index + 1}`}
                />
              ))
            ) : (
              <p>No images available.</p>
            )}
          </div>
          {product.images.length > 0 && (
            <div className={styles.product_images_thumbnail}>
              <img src={product.images[0]} alt={`${product.name}`} />
            </div>
          )}
        </div>

        <div className={styles.product_info}>
          <div className={styles.product_name}>
            <p>{product.name}</p>
          </div>

          <div className={styles.product_category}>
            <p>CATEGORY {product.category}</p>
          </div>

          <div className={styles.product_price}>
            <p>${product.price}</p>
          </div>

          <div className={styles.product_description}>
            <p>{product.description}</p>
          </div>

          <div className={styles.product_color}>
            {product.color.map((color: string) => (
              <div
                key={color}
                className={`${styles.colorOption} ${product.color.includes(color) ? styles.selected : ''}`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => handleColorChange(color.toLowerCase())}
              />
            ))}
            {product.color.length > 0 && (
              <span className={styles.colorLabel}>
                {product.color[0]}
              </span>
            )}
          </div>

          <div className={styles.product_size}>
            <p>Sizes:</p>
            {product.size.length > 0 ? (
              <div className={styles.sizeOptions}>
                {product.size.map((size: string) => (
                  <span
                    key={size} // Use size as the key
                    className={`${styles.sizeOption} ${product.size.includes(size) ? styles.selected : ''}`} // Check if size is selected
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : (
              <p>No sizes available</p>
            )}
          </div>

          <div className={styles.quantityControl}>
            <button onClick={() => handleQuantityChange("decrease")}>-</button>
            <p>{quantity}</p>
            <button onClick={() => handleQuantityChange("increase")}>+</button>
          </div>

          <div className={styles.addCart}>
            <button onClick={() => handleAddCart(`${authData?._id}`, product._id, product.color, product.size[0], quantity)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
