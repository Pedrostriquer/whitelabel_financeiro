import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  FaShareAlt,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaCheck,
  FaHeart,
  FaRegHeart,
  FaEye,
} from "react-icons/fa";
import blogServices from "../../../../dbServices/blogServices";
import { useAuth } from "../../../../Context/AuthContext";
import Modal from "../AuthModal/Modal";
import "./BlogPost.css";

const ProductEmbed = ({ id, options }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await blogServices.getProductById(id);
        setProduct(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);
  if (loading)
    return <div className="blog-product-loader">Carregando oferta...</div>;
  if (!product) return null;
  const price = product.value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const image = product.mediaUrls?.[0] || "https://placehold.co/150";
  const showImg = options.img === "true";
  const showName = options.name === "true";
  const showPrice = options.price === "true";
  const showBtn = options.btn === "true";
  return (
    <a
      href={`/product/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="product-dynamic-card"
    >
      {showImg && (
        <div className="pdc-image">
          <img src={image} alt={product.name} />
        </div>
      )}
      <div className="pdc-info">
        {showName && <h4>{product.name}</h4>}
        {showPrice && <p className="pdc-price">{price}</p>}
        {showBtn && <span className="pdc-btn">Ver Detalhes</span>}
      </div>
    </a>
  );
};

const BlogPost = () => {
  const { id, slug } = useParams();
  const location = useLocation();
  const { user, token, isAuthenticated } = useAuth();
  const userId = user?.id;
  const [post, setPost] = useState(location.state?.postData || null);
  const [loading, setLoading] = useState(!location.state?.postData);
  const [error, setError] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const hasRegisteredView = useRef(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (post) {
      setLoading(false);
      return;
    }
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await blogServices.searchPosts({
          status: 2,
          searchTerm: "",
          pageNumber: 1,
          pageSize: 100,
          token: token,
        });
        if (response.items?.length > 0) {
          const found = response.items.find(
            (item) => String(item.id) === String(id)
          );
          if (found) {
            setPost(found);
            setLikeCount(found.likes ? found.likes.length : 0);
            setViewCount(found.views ? found.views.length : 0);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (!post && id) fetchPost();
  }, [id, slug, post, token]);

  useEffect(() => {
    if (post) {
      if (post.isLikedOverride !== undefined) {
        setIsLiked(post.isLikedOverride);
      } else if (userId && post.likes) {
        setIsLiked(post.likes.includes(userId));
      }
      if (post.likesCountOverride !== undefined)
        setLikeCount(post.likesCountOverride);
      else if (post.likes) setLikeCount(post.likes.length);
      if (post.viewsCountOverride !== undefined)
        setViewCount(post.viewsCountOverride);
      else if (post.views) setViewCount(post.views.length);
    }
  }, [userId, post]);

  useEffect(() => {
    if (post && id && !hasRegisteredView.current) {
      const sessionKey = `viewed_post_${id}`;
      const viewedInSession = sessionStorage.getItem(sessionKey);
      const viewedInHome = post.viewsCountOverride !== undefined;
      const alreadyViewedById =
        userId && post.views?.some((v) => v.clientId === userId);
      if (viewedInSession || viewedInHome || alreadyViewedById) {
        hasRegisteredView.current = true;
        return;
      }
      const timer = setTimeout(() => {
        if (!hasRegisteredView.current) {
          hasRegisteredView.current = true;
          sessionStorage.setItem(sessionKey, "true");
          blogServices.incrementViewCount(id);
          setViewCount((prev) => prev + 1);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [post, id, userId]);

  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      setIsAuthModalOpen(true);
      return;
    }
    const previousLiked = isLiked;
    const previousCount = likeCount;
    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
    try {
      if (previousLiked) {
        await blogServices.unlikePost(id || post.id, token);
      } else {
        await blogServices.likePost(id || post.id, token);
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      if (error.response?.status === 401) setIsAuthModalOpen(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const renderPostContent = (content) => {
    if (!content) return null;
    const regex =
      /\[\[PRODUCT:id=(\d+)\|img=(true|false)\|name=(true|false)\|price=(true|false)\|btn=(true|false)\]\]/g;
    const parts = content.split(regex);
    const elements = [];
    let i = 0;
    while (i < parts.length) {
      const textSegment = parts[i];
      if (textSegment) {
        const formattedText = textSegment.replace(/\n/g, "<br />");
        elements.push(
          <div
            key={`txt-${i}`}
            dangerouslySetInnerHTML={{ __html: formattedText }}
            className="post-text-block"
          />
        );
      }
      if (i + 5 < parts.length && /^\d+$/.test(parts[i + 1])) {
        const pId = parts[i + 1];
        const opts = {
          img: parts[i + 2],
          name: parts[i + 3],
          price: parts[i + 4],
          btn: parts[i + 5],
        };
        elements.push(
          <div key={`prod-${i}`} className="blog-embedded-wrapper">
            <ProductEmbed id={pId} options={opts} />
          </div>
        );
        i += 6;
      } else {
        i++;
      }
    }
    return elements;
  };

  if (loading)
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  if (error || !post)
    return (
      <div className="blog-error-container">
        <h2>Post não encontrado</h2>
        <Link to="/blog" className="back-btn">
          Voltar
        </Link>
      </div>
    );
  const dateFormatted = new Date(
    post.createdAt || post.dateCreated
  ).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="blog-post-page">
      <header className="post-detail-hero">
        <div
          ref={heroRef}
          className="post-hero-bg"
          style={{
            backgroundImage: `url(${
              post.imageUrls?.[0] || "/ecommerce/img/blog/hero-background.jpg"
            })`,
          }}
        />
        <div className="post-hero-overlay"></div>
        <div className="post-hero-content">
          <div className="post-category-badge">
            {post.category?.categoryName || "Artigo"}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <span>
              <FaUser /> Gemas Brilhantes
            </span>
            <span>
              <FaCalendarAlt /> {dateFormatted}
            </span>
            <span>
              <FaEye /> {viewCount}
            </span>
            <span className="meta-like-clickable" onClick={handleLike}>
              {isLiked ? <FaHeart color="#ff4757" /> : <FaRegHeart />}{" "}
              {likeCount}
            </span>
          </div>
        </div>
      </header>

      <main className="post-detail-container">
        <div className="post-detail-actions">
          <Link to="/blog" className="back-link">
            <FaArrowLeft /> Voltar ao Blog
          </Link>
          <div className="right-actions">
            <button
              className={`action-btn-circle ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              className={`share-btn-rect ${linkCopied ? "copied" : ""}`}
              onClick={handleShare}
            >
              {linkCopied ? (
                <>
                  <FaCheck /> Copiado
                </>
              ) : (
                <>
                  <FaShareAlt /> Compartilhar
                </>
              )}
            </button>
          </div>
        </div>

        <article className="post-detail-body">
          {renderPostContent(post.text)}
        </article>

        {post.redirectLink && (
          <div className="post-detail-cta">
            <a
              href={post.redirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              Acessar Conteúdo Externo
            </a>
          </div>
        )}
      </main>
      {isAuthModalOpen && <Modal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default BlogPost;
