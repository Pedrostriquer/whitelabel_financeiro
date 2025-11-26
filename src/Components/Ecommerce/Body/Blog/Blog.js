import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShareAlt, FaCheck, FaArrowRight, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import blogServices from '../../../../dbServices/blogServices';
import { useAuth } from '../../../../Context/AuthContext'; 
import Modal from '../AuthModal/Modal'; 
import './Blog.css';

const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, '-');
};

const PAGE_SIZE = 5;

const BlogPostCard = ({ post, openAuthModal }) => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useAuth();
    const currentUserId = user?.id;

    const [isCopied, setIsCopied] = useState(false);
    const cardRef = useRef(null); 
    
    const hasViewedRef = useRef(false); 
    const viewTimerRef = useRef(null); 

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);
    const [viewCount, setViewCount] = useState(post.views ? post.views.length : 0);
    
    const slug = createSlug(post.title);
    const postUrl = `${window.location.origin}/blog/${post.id}/${slug}`;

    useEffect(() => {
        if (post.likes && currentUserId) {
            setIsLiked(post.likes.includes(currentUserId));
        } else {
            setIsLiked(false);
        }
    }, [currentUserId, post.likes]);

    useEffect(() => {
        const sessionKey = `viewed_post_${post.id}`;
        
        // Verifica Sessão ou API (User ID)
        const viewedInSession = sessionStorage.getItem(sessionKey);
        const alreadyViewedById = currentUserId && post.views?.some(v => v.clientId === currentUserId);

        if (viewedInSession || alreadyViewedById) {
            hasViewedRef.current = true;
            if(!viewedInSession) sessionStorage.setItem(sessionKey, 'true');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            
            if (entry.isIntersecting && !hasViewedRef.current) {
                viewTimerRef.current = setTimeout(() => {
                    if (!hasViewedRef.current) {
                        hasViewedRef.current = true; 
                        sessionStorage.setItem(sessionKey, 'true');

                        setViewCount(prev => prev + 1);
                        blogServices.incrementViewCount(post.id);
                    }
                }, 2000);
            } else {
                if (viewTimerRef.current) {
                    clearTimeout(viewTimerRef.current);
                    viewTimerRef.current = null;
                }
            }
        }, { threshold: 0.7 });

        if (cardRef.current) observer.observe(cardRef.current);

        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
            if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
        };
    }, [post.id, currentUserId, post.views]);

    const goToPost = () => {
        const updatedPostData = { 
            ...post, 
            likesCountOverride: likeCount, 
            isLikedOverride: isLiked,
            viewsCountOverride: viewCount 
        };
        navigate(`/blog/${post.id}/${slug}`, { state: { postData: updatedPostData } });
    };

    const handleLike = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated || !token) {
            openAuthModal(); 
            return;
        }

        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            if (previousLiked) {
                await blogServices.unlikePost(post.id, token);
            } else {
                await blogServices.likePost(post.id, token);
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            if(error.response?.status === 401) openAuthModal();
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(postUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    const image = post.imageUrls?.[0];
    const date = new Date(post.createdAt || post.dateCreated).toLocaleDateString('pt-BR', { 
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const category = post.category ? post.category.categoryName : 'Geral';

    return (
        <article className="blog-horizontal-card" ref={cardRef} onClick={goToPost}>
            <div className="horizontal-card-image-wrapper">
                {image ? (
                    <img src={image} alt={post.title} className="horizontal-card-img" />
                ) : (
                    <div className="horizontal-card-placeholder"></div>
                )}
                <span className="card-category-badge">{category}</span>
            </div>
            
            <div className="horizontal-card-content">
                <div className="card-header">
                    <span className="card-date">{date}</span>
                    <div className="card-actions-top">
                        <button className={`card-share-btn ${isCopied ? 'copied' : ''}`} onClick={handleShare}>
                            {isCopied ? <FaCheck /> : <FaShareAlt />}
                        </button>
                    </div>
                </div>

                <h3 className="card-title">{post.title}</h3>
                
                <p className="card-excerpt">
                    {post.text && post.text.length > 180 ? post.text.substring(0, 180) + '...' : post.text}
                </p>

                <div className="card-footer">
                    <span className="read-more-link">
                        Ler artigo completo <FaArrowRight className="arrow-icon"/>
                    </span>

                    <div className="card-stats">
                        <div className="stat-item view-stat">
                            <FaEye /> <span>{viewCount}</span>
                        </div>
                        <button 
                            className={`stat-item like-btn ${isLiked ? 'liked' : ''}`} 
                            onClick={handleLike}
                        >
                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                            <span>{likeCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const { token } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    const observer = useRef();
    const heroBgRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await blogServices.getBlogCategories();
                setCategories(cats || []);
            } catch (error) {}
        };
        fetchCategories();
    }, []);

    const loadPosts = useCallback(async (page, isNewSearch = false) => {
        setIsLoading(true);
        try {
            const response = await blogServices.searchPosts({
                status: 2, 
                searchTerm: searchTerm, 
                pageNumber: page, 
                pageSize: PAGE_SIZE,
                token: token
            });
            
            const newPosts = response.items || [];
            setPosts(prev => isNewSearch ? newPosts : [...prev, ...newPosts]);
            setHasMore(newPosts.length === PAGE_SIZE);
            setCurrentPage(page);
        } catch (error) {} 
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, token]);

    useEffect(() => {
        const handler = setTimeout(() => { loadPosts(1, true); }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, loadPosts]);

    const lastPostElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { loadPosts(currentPage + 1); }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, loadPosts, currentPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (heroBgRef.current) {
                heroBgRef.current.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredPosts = selectedTag === 'Todos' 
        ? posts 
        : posts.filter(p => p.category?.categoryName === selectedTag);

    return (
        <div className="blog-page-wrapper">
            <section className="blog-hero-section">
                <div ref={heroBgRef} className="hero-background" style={{ backgroundImage: `url('/ecommerce/img/blog/hero-background.jpg')` }} />
                <div className="hero-overlay" />
                <div className="blog-hero-content">
                    <img src="/img/GEMAS BRILHANTES-78.png" alt="Gemas Brilhantes" className="blog-hero-logo" />
                </div>
            </section>

            <section className="blog-controls-section">
                <div className="blog-search-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por título..." 
                        className="blog-search-input" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <div className="tag-filters-container">
                    <button className={`tag-filter-btn ${selectedTag === 'Todos' ? 'active' : ''}`} onClick={() => setSelectedTag('Todos')}>Todos</button>
                    {categories.map(cat => (
                        <button key={cat.id} className={`tag-filter-btn ${selectedTag === cat.categoryName ? 'active' : ''}`} onClick={() => setSelectedTag(cat.categoryName)}>
                            {cat.categoryName}
                        </button>
                    ))}
                </div>
            </section>

            <main className="blog-main-content">
                <div className="blog-list-container">
                    {filteredPosts.map((post, index) => {
                        const isLast = filteredPosts.length === index + 1;
                        return (
                            <div ref={isLast ? lastPostElementRef : null} key={post.id}>
                                <BlogPostCard 
                                    post={post} 
                                    openAuthModal={() => setIsAuthModalOpen(true)}
                                />
                            </div>
                        );
                    })}
                </div>
                
                {isLoading && <div className="loading-spinner-container"><div className="loading-spinner"></div></div>}
                
                {!isLoading && filteredPosts.length === 0 && (
                    <div className="end-of-feed-message">Nenhum post encontrado.</div>
                )}
            </main>

            {isAuthModalOpen && <Modal onClose={() => setIsAuthModalOpen(false)} />}
        </div>
    );
};

export default Blog;