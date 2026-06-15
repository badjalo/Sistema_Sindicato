import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    ArrowRight, Calendar, Clock, Tag, ChevronLeft, ChevronRight,
    Search, Filter, Heart, MessageCircle, Share2, Menu, X, Lock
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

// ─── NAVBAR ─────────────────────────────────────────────────────────────────
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const currentPath = window.location.pathname;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { label: 'Início', to: '/' },
        { label: 'O Sindicato', to: '/sindicato' },
        { label: 'Notícias', to: '/noticias' },
        { label: 'Documentos', to: '/documentos-publicos' },
        { label: 'Contacto', to: '/', hash: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo + Name */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img
                            src={logo}
                            alt="SF-DGCI Logo"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-yellow-400 shadow"
                        />
                        <div className="leading-tight">
                            <p className="text-sm font-black text-[#1a2f5e] tracking-wide">SF-DGCI</p>
                            <p className="text-[10px] text-gray-500 font-medium">Sistema de Gestão Sindical</p>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((l) => {
                            const isActive = l.hash 
                                ? currentPath === '/' && window.location.hash === l.hash
                                : currentPath === l.to;
                            
                            if (l.hash) {
                                return (
                                    <a
                                        key={l.label}
                                        href={currentPath === '/' ? l.hash : `${l.to}${l.hash}`}
                                        className={`text-sm font-semibold transition-colors duration-200 px-3 py-1.5 rounded-xl ${
                                            isActive 
                                                ? 'text-blue-600 bg-blue-50/50' 
                                                : 'text-gray-600 hover:text-[#1a2f5e] hover:bg-slate-50'
                                        }`}
                                    >
                                        {l.label}
                                    </a>
                                );
                            }
                            
                            return (
                                <Link
                                    key={l.label}
                                    to={l.to}
                                    className={`text-sm font-semibold transition-colors duration-200 px-3 py-1.5 rounded-xl ${
                                        isActive 
                                            ? 'text-blue-600 bg-blue-50/50' 
                                            : 'text-gray-600 hover:text-[#1a2f5e] hover:bg-slate-50'
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-[#1a2f5e] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0f1f42] transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Lock size={14} />
                            Entrar no Sistema
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-2">
                        {navLinks.map((l) => {
                            const isActive = l.hash 
                                ? currentPath === '/' && window.location.hash === l.hash
                                : currentPath === l.to;
                            
                            if (l.hash) {
                                return (
                                    <a
                                        key={l.label}
                                        href={currentPath === '/' ? l.hash : `${l.to}${l.hash}`}
                                        onClick={() => setMenuOpen(false)}
                                        className={`block text-sm font-semibold p-2.5 rounded-lg ${
                                            isActive 
                                                ? 'text-blue-600 bg-blue-50' 
                                                : 'text-gray-700 hover:text-[#1a2f5e] hover:bg-slate-50'
                                        }`}
                                    >
                                        {l.label}
                                    </a>
                                );
                            }
                            
                            return (
                                <Link
                                    key={l.label}
                                    to={l.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block text-sm font-semibold p-2.5 rounded-lg ${
                                        isActive 
                                            ? 'text-blue-600 bg-blue-50' 
                                            : 'text-gray-700 hover:text-[#1a2f5e] hover:bg-slate-50'
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                        <div className="pt-2">
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-[#1a2f5e] text-white text-sm font-bold w-full py-3 rounded-xl hover:bg-[#0f1f42] transition-colors"
                            >
                                <Lock size={14} /> Entrar no Sistema
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// ─── HERO ────────────────────────────────────────────────────────────────────
const HeroSection = () => (
    <section className="relative min-h-[400px] flex flex-col justify-center overflow-hidden pt-20">
        {/* Background gradient */}
        <div
            className="absolute inset-0 z-0"
            style={{ background: 'linear-gradient(135deg, #0f1f42 0%, #1a2f5e 100%)' }}
        />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full border border-white/5 z-0" />
        <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full border border-white/5 z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 max-w-4xl mx-auto">
                Notícias e <span className="text-[#facc15]">Comunicados</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
                Mantenha-se informado sobre todas as atualizações, eventos e comunicados importantes do sindicato.
            </p>
        </div>
    </section>
);

// ─── NEWS GRID ───────────────────────────────────────────────────────────────
// ─── NEWS GRID ───────────────────────────────────────────────────────────────
const NewsGrid = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNews, setSelectedNews] = useState(null);
    const [likedIds, setLikedIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sf_liked_news') || '[]'); }
        catch { return []; }
    });
    const [likeCounts, setLikeCounts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sf_like_counts') || '{}'); }
        catch { return {}; }
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/comunicados/publicos');
            if (response.data.success && response.data.data) {
                const newsData = response.data.data.map(item => ({
                    id: item.id,
                    title: item.titulo,
                    excerpt: item.conteudo?.substring(0, 100) + '...' || 'Sem descrição',
                    content: item.conteudo || '',
                    category: mapCategory(item.tipo),
                    tipo: item.tipo,
                    date: item.data_publicacao || item.criado_em,
                    author: item.autor_nome || 'Administração',
                    image: null,
                    comments: 0,
                    featured: item.urgente === true,
                }));
                setNews(newsData);
            }
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
        } finally {
            setLoading(false);
        }
    };

    const mapCategory = (tipo) => {
        const categoryMap = {
            'aviso': 'Aviso',
            'circular': 'Circular',
            'convocatoria': 'Convocação',
            'informacao': 'Informação',
            'urgente': 'Urgente',
        };
        return categoryMap[tipo] || tipo;
    };

    const getCategoryStyle = (tipo) => {
        const m = {
            aviso: 'bg-orange-100 text-orange-700',
            circular: 'bg-blue-100 text-blue-700',
            convocatoria: 'bg-purple-100 text-purple-700',
            informacao: 'bg-blue-100 text-blue-700',
            urgente: 'bg-red-100 text-red-600'
        };
        return m[tipo] || 'bg-yellow-100 text-yellow-700';
    };

    const categories = ['Todas', 'Aviso', 'Circular', 'Convocação', 'Informação', 'Urgente'];

    const filteredNews = news.filter((item) => {
        const matchesCategory = filter === 'Todas' || item.category === filter;
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredNews = filteredNews.filter((n) => n.featured);
    const regularNews = filteredNews.filter((n) => !n.featured);

    const toggleLike = (e, id) => {
        e.stopPropagation();
        const isLiked = likedIds.includes(id);
        const newLiked = isLiked ? likedIds.filter(x => x !== id) : [...likedIds, id];
        const newCounts = { ...likeCounts, [id]: Math.max(0, (likeCounts[id] || 0) + (isLiked ? -1 : 1)) };
        setLikedIds(newLiked);
        setLikeCounts(newCounts);
        localStorage.setItem('sf_liked_news', JSON.stringify(newLiked));
        localStorage.setItem('sf_like_counts', JSON.stringify(newCounts));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                const cleaned = String(dateString).replace(/\+\d{2}$/, ':00');
                const date2 = new Date(cleaned);
                if (isNaN(date2.getTime())) return 'N/A';
                return date2.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
            }
            return date.toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (error) {
            return 'N/A';
        }
    };

    return (
        <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Procurar notícias..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative">
                            <Filter size={18} className="absolute left-3.5 top-3 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white cursor-pointer"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${filter === cat
                                    ? 'bg-[#1a2f5e] text-white'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#1a2f5e]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2f5e]"></div>
                        </div>
                        <p className="text-gray-500 mt-4">A carregar notícias...</p>
                    </div>
                ) : (
                    <>
                        {/* Featured News Carousel */}
                        {featuredNews.length > 0 && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-black text-[#0f1f42] mb-8">Em Destaque</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredNews.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedNews(item)}
                                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-yellow-400/50 transition-all duration-300 cursor-pointer"
                                        >
                                            {/* Image placeholder */}
                                                             {/* Content */}
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold tracking-wide rounded-md ${getCategoryStyle(item.tipo)}`}>
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar size={12} /> {formatDate(item.date)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-[#0f1f42] mb-2 group-hover:text-yellow-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <button
                                                            onClick={(e) => toggleLike(e, item.id)}
                                                            className={`flex items-center gap-1.5 font-semibold transition-all duration-200 ${likedIds.includes(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                                            title={likedIds.includes(item.id) ? 'Remover curtida' : 'Curtir'}
                                                        >
                                                            <Heart size={14} className={likedIds.includes(item.id) ? 'fill-red-500 text-red-500' : ''} />
                                                            {likeCounts[item.id] || 0}
                                                        </button>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle size={14} /> {item.comments}
                                                        </span>
                                                    </div>
                                                    <button className="text-yellow-600 hover:text-yellow-700 transition-colors">
                                                        <Share2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Regular News List */}
                        {regularNews.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black text-[#0f1f42] mb-8">Todas as Notícias</h2>
                                <div className="space-y-4">
                                    {regularNews.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedNews(item)}
                                            className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-yellow-400/50 transition-all duration-300 cursor-pointer flex gap-4"
                                        >
                                            {/* Icon */}
                                            <div className="bg-gradient-to-br from-[#1a2f5e]/10 to-yellow-400/10 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Tag size={24} className="text-[#1a2f5e]/50" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold tracking-wide rounded-md ${getCategoryStyle(item.tipo)}`}>
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar size={12} /> {formatDate(item.date)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">{item.author}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-[#0f1f42] mb-1 group-hover:text-yellow-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
                                            </div>

                                            {/* Stats */}
                                            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                                                <button
                                                    onClick={(e) => toggleLike(e, item.id)}
                                                    className={`flex items-center gap-1.5 font-semibold transition-all duration-200 ${likedIds.includes(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                                    title={likedIds.includes(item.id) ? 'Remover curtida' : 'Curtir'}
                                                >
                                                    <Heart size={14} className={likedIds.includes(item.id) ? 'fill-red-500 text-red-500' : ''} />
                                                    {likeCounts[item.id] || 0}
                                                </button>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={14} /> {item.comments}
                                                </span>
                                            </div>

                                            <ChevronRight size={18} className="text-gray-300 group-hover:text-yellow-400 flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {filteredNews.length === 0 && (
                            <div className="text-center py-16">
                                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhuma notícia encontrada</h3>
                                <p className="text-gray-500">Tente ajustar seus filtros ou termos de pesquisa.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Modal para ver notícia completa */}
                {selectedNews && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-[#1a2f5e] to-[#0f1f42] p-6 text-white flex items-center justify-between">
                                <div>
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold tracking-wide rounded-md ${getCategoryStyle(selectedNews.tipo)} mb-2`}>
                                        {selectedNews.category}
                                    </span>
                                    <h2 className="text-2xl font-black">{selectedNews.title}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {formatDate(selectedNews.date)}
                                    </span>
                                    <span>•</span>
                                    <span>{selectedNews.author}</span>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedNews.content}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center gap-4">
                                    <button
                                        onClick={(e) => toggleLike(e, selectedNews.id)}
                                        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${likedIds.includes(selectedNews.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
                                    >
                                        <Heart size={15} className={likedIds.includes(selectedNews.id) ? 'fill-red-500 text-red-500' : ''} />
                                        {likedIds.includes(selectedNews.id) ? 'Curtido' : 'Curtir'} · {likeCounts[selectedNews.id] || 0}
                                    </button>
                                    <span className="flex items-center gap-1 text-sm">
                                        <MessageCircle size={14} /> {selectedNews.comments} comentários
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="bg-[#1a2f5e] hover:bg-[#0f1f42] text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// ─── FOOTER ─────────────────────────────────────────────────────────────────
const Footer = () => (
    <footer style={{ background: '#0a1628' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-slate-600 text-xs mb-2">
                © {new Date().getFullYear()} SF-DGCI — Todos os direitos reservados
            </p>
            <p className="text-slate-600 text-xs">
                República da Guiné-Bissau • Ministério das Finanças
            </p>
        </div>
    </footer>
);

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
const Noticias = () => {
    return (
        <div className="font-sans antialiased">
            <Navbar />
            <HeroSection />
            <NewsGrid />
            <Footer />
        </div>
    );
};

export default Noticias;
