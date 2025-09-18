import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './Blog.css';
import { FaHeart, FaEye, FaSearch, FaTag, FaChevronDown } from 'react-icons/fa';

// --- CUSTOM HOOK PARA ANIMAÇÃO DE VISIBILIDADE ---
const useOnScreen = (options) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// --- HOOK DO CONTADOR DE VISUALIZAÇÕES ATUALIZADO ---
const useViewCount = (initialViews, postId) => {
  const [views, setViews] = useState(initialViews);
  const [hasViewed, setHasViewed] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [ref, isVisible] = useOnScreen({ threshold: 1.0 });

  useEffect(() => {
    if (isVisible && !hasViewed) {
      const viewTimeout = setTimeout(() => {
        setViews(prevViews => prevViews + 1);
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


// --- DADOS ESTÁTICOS ---
const allBlogPosts = [
  {
    id: 1,
    title: "Promoção Exclusiva: Até 50% OFF em Anéis de Diamante!",
    author: "Gemas Brilhantes",
    date: "12 de Setembro, 2025",
    image: "/ecommerce/img/lumos-diamond-promo-oct.jpg",
    content: "Não perca nossa promoção anual! Uma seleção incrível de anéis de diamante com descontos imperdíveis. A oportunidade perfeita para encontrar a joia dos seus sonhos e celebrar momentos inesquecíveis com um brilho que dura para sempre. Nossas peças são certificadas e garantem a mais alta qualidade. Explore a coleção e descubra designs que vão do clássico ao contemporâneo, todos com o corte perfeito para maximizar o brilho. Esta é a sua chance de fazer um investimento eterno em beleza e elegância.",
    tags: ["Promoção", "Diamantes"],
    views: 1523,
    likes: 257,
    isLiked: false,
    cta: { text: "Ver Promoção Agora", link: "/ecommerce/joias" }
  },
  {
    id: 2,
    title: "A Fascinante Jornada da Esmeralda: Da Mina à Joalheria",
    author: "Equipe Gemas Brilhantes",
    date: "10 de Setembro, 2025",
    image: null,
    content: "As esmeraldas são reverenciadas há milênios, símbolos de renascimento e amor. Mas você já se perguntou sobre o incrível percurso que essa gema faz até chegar em uma joia deslumbrante? Neste post, exploramos o processo de mineração, a lapidação artesanal que revela sua cor e brilho únicos, e a arte da ourivesaria que a transforma em uma peça de desejo. Cada esmeralda conta uma história de milhões de anos.",
    tags: ["Curiosidades", "Esmeraldas"],
    views: 980,
    likes: 150,
    isLiked: true,
    cta: null
  },
  {
    id: 3,
    title: "Lançamento da Coleção 'Aurora Boreal'",
    author: "Gemas Brilhantes",
    date: "08 de Setembro, 2025",
    image: "/ecommerce/img/4.jpg",
    content: "Inspirada nas luzes do norte, nossa nova coleção 'Aurora Boreal' traz uma combinação mágica de opalas, turmalinas e diamantes. Uma verdadeira obra de arte vestível que captura o movimento e as cores etéreas de um dos fenômenos mais espetaculares da natureza.",
    tags: ["Lançamentos", "Joias"],
    views: 2109,
    likes: 450,
    isLiked: false,
    cta: { text: "Conheça a Coleção", link: "/ecommerce/joias" }
  },
  {
    id: 4,
    title: "Ouro 18k vs. Ouro 24k: Qual a Diferença?",
    author: "Joalheiro Convidado",
    date: "06 de Setembro, 2025",
    image: "/ecommerce/img/images.jpeg",
    content: "Entenda de uma vez por todas a diferença entre os quilates do ouro. O Ouro 24k é puro, mas maleável. O 18k, com 75% de ouro, oferece a durabilidade ideal para joias do dia a dia. Saiba qual escolher para sua próxima peça.",
    tags: ["Curiosidades", "Cuidados"],
    views: 301,
    likes: 540,
    isLiked: false,
    cta: null
  },
  {
    id: 5,
    title: "GEMCASH: Seu Cashback em Forma de Brilho",
    author: "Gemas Brilhantes",
    date: "04 de Setembro, 2025",
    image: null,
    content: "Conheça o GemCash, nosso programa de fidelidade exclusivo. Todas as suas compras em nosso site se transformam em créditos para você adquirir novas joias com descontos incríveis. É a nossa forma de agradecer por sua preferência.",
    tags: ["Notícias", "GemCash"],
    views: 1842,
    likes: 312,
    isLiked: false,
    cta: { text: "Saiba Mais", link: "/ecommerce/gemcash" }
  },
  {
    id: 6,
    title: "Top 5 Pedras Preciosas para Anéis de Noivado",
    author: "Gemas Brilhantes",
    date: "02 de Setembro, 2025",
    image: "/ecommerce/img/blog/post-noivado.jpg",
    content: "Além do clássico diamante, existem outras gemas espetaculares para selar o seu amor. Safiras, rubis, esmeraldas... Conheça as 5 melhores alternativas que combinam beleza, durabilidade e um significado especial.",
    tags: ["Diamantes", "Joias"],
    views: 4500,
    likes: 890,
    isLiked: false,
    cta: { text: "Veja Anéis de Noivado", link: "/ecommerce/joias" }
  },
  {
    id: 7,
    title: "Como Identificar uma Pérola Verdadeira",
    author: "Especialista em Gemas",
    date: "30 de Agosto, 2025",
    image: null,
    content: "Pérolas são clássicos atemporais, mas como diferenciar uma verdadeira de uma imitação? Damos dicas práticas, como o famoso teste da mordida e a observação da superfície, para você nunca mais ter dúvidas.",
    tags: ["Curiosidades", "Cuidados"],
    views: 2800,
    likes: 410,
    isLiked: false,
    cta: null
  },
  {
    id: 8,
    title: "A beleza minimalista das joias geométricas",
    author: "Gemas Brilhantes",
    date: "28 de Agosto, 2025",
    image: "/ecommerce/img/blog/post-geometrica.jpg",
    content: "Linhas retas, formas limpas e um design moderno. As joias geométricas são a tendência perfeita para quem ama um estilo sofisticado e discreto. Veja como incorporar essa tendência em seus looks.",
    tags: ["Lançamentos", "Joias"],
    views: 1950,
    likes: 350,
    isLiked: false,
    cta: null
  },
  {
    id: 9,
    title: "Conheça a Turmalina Paraíba: a joia neon do Brasil",
    author: "Equipe Gemas Brilhantes",
    date: "25 de Agosto, 2025",
    image: "/ecommerce/img/blog/post-paraiba.jpg",
    content: "Com seu brilho azul neon inconfundível, a Turmalina Paraíba é uma das gemas mais raras e desejadas do mundo. Descubra a história e as características que tornam essa pedra brasileira tão especial e valiosa.",
    tags: ["Notícias", "Curiosidades"],
    views: 5100,
    likes: 950,
    isLiked: true,
    cta: { text: "Ver Turmalinas", link: "/ecommerce/gemaspreciosas" }
  },
  {
    id: 10,
    title: "Manutenção de Joias: Limpeza Profissional vs. Caseira",
    author: "Joalheiro Convidado",
    date: "22 de Agosto, 2025",
    image: null,
    content: "Manter suas joias brilhando é essencial. Mas quando fazer uma limpeza em casa e quando procurar um profissional? Explicamos os prós e contras de cada método e quais produtos usar para não danificar suas peças.",
    tags: ["Cuidados"],
    views: 2300,
    likes: 380,
    isLiked: false,
    cta: null
  },
  {
    id: 11,
    title: "Presente de Aniversário: a pedra preciosa de cada mês",
    author: "Gemas Brilhantes",
    date: "20 de Agosto, 2025",
    image: "/ecommerce/img/blog/post-birthstone.jpg",
    content: "Quer dar um presente com um significado extra? Conheça as 'birthstones', as pedras preciosas associadas a cada mês de nascimento. Uma forma única e pessoal de presentear quem você ama. Descubra qual é a sua!",
    tags: ["Joias", "Curiosidades"],
    views: 3800,
    likes: 620,
    isLiked: false,
    cta: null
  },
  {
    id: 12,
    title: "Nosso Compromisso com a Mineração Responsável",
    author: "Diretoria",
    date: "18 de Agosto, 2025",
    image: null,
    content: "Acreditamos que o luxo verdadeiro deve ser ético. Conheça nossas práticas de sourcing e nosso compromisso com a mineração responsável, garantindo que cada gema em nossas joias venha de fontes livres de conflito e com respeito ao meio ambiente e às comunidades locais.",
    tags: ["Notícias"],
    views: 1200,
    likes: 280,
    isLiked: false,
    cta: null
  }
];

const PAGE_SIZE = 5;

const BlogPostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  const [viewCountRef, views, animateViews] = useViewCount(post.views, post.id);

  useEffect(() => {
    const checkOverflow = () => { if (contentRef.current) { setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight); } };
    const timeoutId = setTimeout(checkOverflow, 150);
    window.addEventListener('resize', checkOverflow);
    return () => { clearTimeout(timeoutId); window.removeEventListener('resize', checkOverflow); }
  }, [post.content]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div ref={viewCountRef} className={`blog-post-card ${post.image ? '' : 'no-image'} ${isExpanded ? 'is-expanded' : ''}`}>
      {post.image && ( <div className="post-image-container"><img src={post.image} alt={post.title} className="post-image" /></div> )}
      <div className="post-content-wrapper">
        <div className="post-header"><div className="post-tags">{post.tags.map(tag => <span key={tag} className="post-tag">{tag}</span>)}</div><p className="post-meta">{post.author} • {post.date}</p></div>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-excerpt" ref={contentRef}><p>{post.content}</p></div>
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
        {post.cta && (<div className="post-actions"><a href={post.cta.link} className="post-cta-btn">{post.cta.text}</a></div>)}
      </div>
    </div>
  );
};

// **ALTERAÇÃO**: A classe `timeline-item` foi renomeada para `blog-post-wrapper`
const PostWrapper = ({ post }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    return (
      <div ref={ref} className={`blog-post-wrapper ${isVisible ? 'is-visible' : ''}`}>
        <BlogPostCard post={post} />
      </div>
    );
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');

  const [visiblePosts, setVisiblePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const heroBgRef = useRef(null);

  const allTags = useMemo(() => {
    const tags = new Set();
    allBlogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return ['Todos', ...Array.from(tags)];
  }, []);

  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter(post => {
      const matchesTag = selectedTag === 'Todos' || post.tags.includes(selectedTag);
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [searchTerm, selectedTag]);

  useEffect(() => {
    setVisiblePosts(filteredPosts.slice(0, PAGE_SIZE));
    setCurrentPage(1);
    setHasMore(filteredPosts.length > PAGE_SIZE);
  }, [filteredPosts]);
  
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newPosts = filteredPosts.slice(currentPage * PAGE_SIZE, nextPage * PAGE_SIZE);
      
      setVisiblePosts(prevPosts => [...prevPosts, ...newPosts]);
      setCurrentPage(nextPage);
      setHasMore(filteredPosts.length > nextPage * PAGE_SIZE);
      setIsLoading(false);
    }, 700);
  }, [currentPage, isLoading, hasMore, filteredPosts]);
  
  const loadMoreTriggerRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    }, {
      rootMargin: '0px 0px 200px 0px'
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroBgRef.current) {
            heroBgRef.current.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );

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
        <div className="tag-filters-container"><FaTag className="tag-icon" />{allTags.map(tag => ( <button key={tag} className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`} onClick={() => setSelectedTag(tag)}> {tag} </button> ))}</div>
      </section>

      <main className="blog-main-content">
        {/* **ALTERAÇÃO**: A classe `blog-timeline` foi renomeada para `blog-posts-container` */}
        <div className="blog-posts-container">
          {visiblePosts.map(post => <PostWrapper key={post.id} post={post} />)}
        </div>
        
        {hasMore && <div ref={loadMoreTriggerRef} />}

        {isLoading && <LoadingSpinner />}
        {!hasMore && visiblePosts.length > 0 && <div className="end-of-feed-message">Você chegou ao fim!</div>}
      </main>
    </div>
  );
};

export default Blog;