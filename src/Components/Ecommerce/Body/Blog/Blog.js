// Caminho: src/Components/Ecommerce/Body/Blog/Blog.js

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../Context/AuthContext';
import blogServices from '../../../../dbServices/blogServices';
import './Blog.css';
import { FaHeart, FaEye, FaSearch, FaTag, FaChevronDown } from 'react-icons/fa';

// --- COMPONENTE PARA O "POPDOWN" (TOAST) DE AUTENTICAÇÃO ---
const AuthToast = ({ closeToast }) => (
    <div className="auth-toast-content">
        <h4>Ação necessária</h4>
        <p>Você precisa de uma conta para interagir. Entre ou crie uma conta agora.</p>
        <div className="auth-toast-actions">
            <Link to="/login" className="auth-toast-btn login" onClick={closeToast}>Entrar</Link>
            <Link to="/cadastro" className="auth-toast-btn register" onClick={closeToast}>Criar Conta</Link>
        </div>
    </div>
);

// --- HOOKS E COMPONENTES AUXILIARES ---
const useOnScreen = (options) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, options);
    const currentRef = ref.current;
    if (currentRef) { observer.observe(currentRef); }
    return () => { if (currentRef) { observer.unobserve(currentRef); } };
  }, [ref, options]);
  return [ref, isVisible];
};

const useViewCount = (initialViews, postId) => {
  const [views, setViews] = useState(initialViews);
  const [hasViewed, setHasViewed] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [ref, isVisible] = useOnScreen({ threshold: 1.0 });

  useEffect(() => {
    if (isVisible && !hasViewed) {
      const viewTimeout = setTimeout(() => {
        blogServices.incrementViewCount(postId);
        setViews(prev => prev + 1);
        setHasViewed(true);
        setAnimate(true);
        const animationTimeout = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(animationTimeout);
      }, 1000);
      return () => clearTimeout(viewTimeout);
    }
  }, [isVisible, hasViewed, postId]);
  return [ref, views, animate];
};

const PAGE_SIZE = 5;

// --- COMPONENTE CARD DO POST ---
const BlogPostCard = ({ post }) => {
  const { user, token } = useAuth();

  // ✨ CORREÇÃO 1: Usar .length pois a API retorna um array.
  const [isLiked, setIsLiked] = useState(post.isLikedByUser ?? false);
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  
  // ✨ CORREÇÃO 2: Usar .length para views também.
  const [viewCountRef, views, animateViews] = useViewCount(post.views?.length ?? 0, post.id);

  useEffect(() => {
    const checkOverflow = () => { if (contentRef.current) { setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight); } };
    const timeoutId = setTimeout(checkOverflow, 150);
    window.addEventListener('resize', checkOverflow);
    return () => { clearTimeout(timeoutId); window.removeEventListener('resize', checkOverflow); }
  }, [post.text]);

  const handleLikeClick = async () => {
    if (!user || !token) {
      toast(<AuthToast />, { position: "bottom-center", autoClose: 6000, className: 'auth-toast' });
      return;
    }
    const originalLikedState = isLiked;
    const originalLikeCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      if (originalLikedState) { await blogServices.unlikePost(post.id, token); }
      else { await blogServices.likePost(post.id, token); }
    } catch (error) {
      setIsLiked(originalLikedState);
      setLikeCount(originalLikeCount);
      toast.error("Ocorreu um erro. Tente novamente.");
    }
  };
  
  const cardData = {
    ...post,
    image: post.imageUrls?.[0] || null,
    tags: post.category ? [post.category.categoryName] : [],
    content: post.text,
    date: new Date(post.createdAt || post.dateCreated).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'}),
    author: "Gemas Brilhantes",
    cta: post.redirectLink ? { text: "Saiba Mais", link: post.redirectLink } : null
  };

  return (
    <div ref={viewCountRef} className={`blog-post-card ${cardData.image ? '' : 'no-image'} ${isExpanded ? 'is-expanded' : ''}`}>
        {cardData.image && ( <div className="post-image-container"><img src={cardData.image} alt={cardData.title} className="post-image" /></div> )}
        <div className="post-content-wrapper">
            <div className="post-header"><div className="post-tags">{cardData.tags.map(tag => <span key={tag} className="post-tag">{tag}</span>)}</div><p className="post-meta">{cardData.author} • {cardData.date}</p></div>
            <h3 className="post-title">{cardData.title}</h3>
            <div className="post-excerpt" ref={contentRef}><p>{cardData.content}</p></div>
            {isOverflowing && (<button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "Ver menos" : "Ver mais"}<FaChevronDown className="expand-icon" /></button>)}
        </div>
        <div className="post-footer">
            <div className="post-stats">
            <div className="like-action">
                <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}><FaHeart /></button>
                <span className="like-count">{likeCount.toLocaleString('pt-BR')}</span>
            </div>
            <div className="views-action">
                <FaEye />
                <span className={`view-count ${animateViews ? 'animate-pulse' : ''}`}>{views.toLocaleString('pt-BR')}</span>
            </div>
            </div>
            {cardData.cta && (<div className="post-actions"><a href={cardData.cta.link} className="post-cta-btn">{cardData.cta.text}</a></div>)}
        </div>
    </div>
  );
};

const PostWrapper = ({ post }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    return ( <div ref={ref} className={`blog-post-wrapper ${isVisible ? 'is-visible' : ''}`}><BlogPostCard post={post} /></div> );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA DO BLOG ---
const Blog = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const heroBgRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try { const cats = await blogServices.getBlogCategories(); setCategories(cats || []); }
      catch (error) { console.error("Falha ao buscar categorias:", error); }
    };
    fetchCategories();
  }, []);

  // ✨ CORREÇÃO 3: Removida a dependência de 'isLoading' para quebrar o loop.
  const loadPosts = useCallback(async (page, isNewSearch = false) => {
    setIsLoading(true);
    try {
        const response = await blogServices.searchPosts({
            status: 2, searchTerm: searchTerm, pageNumber: page, pageSize: PAGE_SIZE, token: token
        });
        const newPosts = response.items || [];
        setPosts(prev => isNewSearch ? newPosts : [...prev, ...newPosts]);
        setHasMore(newPosts.length === PAGE_SIZE);
        setCurrentPage(page);
    } catch (error) {
        toast.error("Erro ao carregar os posts.");
    } finally {
        setIsLoading(false);
    }
  }, [searchTerm, token]); // Dependências estáveis ou controladas

  // ✨ CORREÇÃO 4: A dependência de 'loadPosts' foi removida para quebrar o loop.
  useEffect(() => {
    const handler = setTimeout(() => {
        loadPosts(1, true);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, loadPosts]); // loadPosts é estável agora

  const loadMorePosts = useCallback(() => {
    if (!isLoading && hasMore) { loadPosts(currentPage + 1); }
  }, [currentPage, isLoading, hasMore, loadPosts]);

  const loadMoreTriggerRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) { loadMorePosts(); }
    }, { rootMargin: '0px 0px 200px 0px' });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroBgRef.current) { heroBgRef.current.style.transform = `translateY(${window.pageYOffset * 0.3}px)`; }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const LoadingSpinner = () => (<div className="loading-spinner-container"><div className="loading-spinner"></div></div>);
  
  const filteredPosts = posts.filter(post => selectedTag === 'Todos' || post.category?.categoryName === selectedTag);

  return (
    <div className="blog-page-wrapper">
        <section className="blog-hero-section">
            <div ref={heroBgRef} className="hero-background" style={{ backgroundImage: `url('/ecommerce/img/blog/hero-background.jpg')` }} />
            <div className="hero-overlay" />
            <div className="blog-hero-content">
            <h1 className="blog-hero-title fonte-principal">Nosso Diário</h1>
            <p className="blog-hero-subtitle">Notícias, tendências e histórias do universo das joias.</p>
            </div>
        </section>
        <section className="blog-controls-section">
            <div className="blog-search-container"><FaSearch className="search-icon" /><input type="text" placeholder="Pesquisar por título ou conteúdo..." className="blog-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="tag-filters-container">
                <FaTag className="tag-icon" />
                <button className={`tag-filter-btn ${selectedTag === 'Todos' ? 'active' : ''}`} onClick={() => setSelectedTag('Todos')}>Todos</button>
                {categories.map(cat => ( <button key={cat.id} className={`tag-filter-btn ${selectedTag === cat.categoryName ? 'active' : ''}`} onClick={() => setSelectedTag(cat.categoryName)}> {cat.categoryName} </button> ))}
            </div>
        </section>
        <main className="blog-main-content">
            <div className="blog-posts-container">
            {filteredPosts.map(post => <PostWrapper key={post.id} post={post} />)}
            </div>
            {hasMore && <div ref={loadMoreTriggerRef} />}
            {isLoading && <LoadingSpinner />}
            {!hasMore && posts.length > 0 && <div className="end-of-feed-message">Você chegou ao fim!</div>}
            {!isLoading && posts.length === 0 && <div className="end-of-feed-message">Nenhum post encontrado.</div>}
        </main>
    </div>
  );
};

export default Blog;