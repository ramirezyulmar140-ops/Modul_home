import { useState } from 'react';
import { Check, ArrowRight, Layers } from 'lucide-react';
import { catalogData } from '../data/catalogData';
import { Link } from 'react-router-dom';

export default function Catalog() {
    const archStyles = catalogData.filter(s => s.id !== 'plywood');
    const plywoodStyle = catalogData.find(s => s.id === 'plywood');
    const [activeTab, setActiveTab] = useState(archStyles[0].id);

    const activeStyle = archStyles.find(s => s.id === activeTab) || archStyles[0];

    return (
        <section id="catalog" className="py-24 bg-gray-50 relative">

            {/* БЛОК 1: ТИПОВЫЕ МОДУЛИ ИЗ ФАНЕРЫ (Готовые решения) */}
            {plywoodStyle && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm mb-4 border border-green-200 w-fit">
                            Готовые решения
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6">
                            {plywoodStyle.name}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {plywoodStyle.description}
                        </p>
                    </div>

                    <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar">
                        {plywoodStyle.layouts.map((project, idx) => (
                            <div
                                key={`plywood-layout-${project.name}-${idx}`}
                                className={`min-w-[280px] sm:min-w-0 snap-center rounded-2xl bg-white border ${project.popular ? 'border-green-600 shadow-lg ring-1 ring-green-600' : 'border-gray-200'} transition-all duration-300 flex flex-col group/card hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className="h-64 overflow-hidden relative rounded-t-2xl bg-gray-100">
                                    {/* Основное фото здания */}
                                    <img 
                                        src={project.images && project.images.length > 1 && project.images[0] === project.image ? project.images[1] : (project.images ? project.images[0] : project.image)} 
                                        alt={project.name} 
                                        className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out group-hover/card:opacity-0" 
                                        loading="lazy" 
                                    />
                                    {/* Планировка (показывается при наведении) */}
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                                        <img 
                                            src={project.image} 
                                            alt={`Планировка ${project.name}`} 
                                            className="max-w-full max-h-full object-contain" 
                                            loading="lazy" 
                                        />
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10 transition-opacity duration-300 group-hover/card:opacity-0">
                                            {project.tags.map((tag, i) => (
                                                <div key={i} className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-md shadow-sm border ${i === 0 ? 'bg-green-600 text-white border-green-500' : 'bg-white/95 text-gray-800 backdrop-blur-md border-gray-200'} `}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col rounded-b-2xl bg-white border-t-0 shadow-sm relative z-20">
                                    <h4 className="text-2xl font-bold font-serif mb-2 text-gray-900 group-hover/card:text-green-700 transition-colors">{project.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700 mb-4 pb-4 border-b border-gray-100">
                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">{project.area}</span>
                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">{project.dimensions}</span>
                                    </div>
                                    <ul className="space-y-2.5 mb-6 flex-1">
                                        {project.features.slice(0, 3).map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-end mt-auto pt-4 bg-gray-50/50 -mx-6 -mb-6 px-6 py-5 rounded-b-2xl border-t border-gray-50">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Цена от</div>
                                            <div className="text-2xl font-display text-gray-900 leading-none">{project.price} ₽</div>
                                        </div>
                                        <Link to={`/project/${project.id}`} className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover/card:bg-green-600 group-hover/card:text-white transition-colors duration-300">
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover/card:-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ----------- БЛОК 2: Плитки стилей на заказ ----------- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mb-4 border border-blue-200 w-fit">
                        Индивидуальный выбор
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6">
                        Популярные архитектурные стили
                    </h2>
                    <p className="text-lg text-gray-600">
                        Если типовые модули не подходят — выберите свой стиль. Каждый имеет множество продуманных планировок — от студий до семейных коттеджей.
                    </p>
                </div>

                {/* Контейнер для стилей: Горизонтальный скролл на мобилках, Сетка (Сетки) на планшетах/desktop */}
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 md:mb-16 snap-x snap-mandatory hide-scrollbar">
                    {archStyles.map((style) => (
                        <div
                            key={`v2-${style.id}`}
                            className={`min-w-[280px] sm:min-w-0 snap-center rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${activeTab === style.id ? 'ring-4 ring-green-500 ring-offset-2 md:ring-offset-4' : 'hover:-translate-y-2 hover:shadow-2xl'}`}
                            onClick={() => setActiveTab(style.id)}
                        >
                            <div className="h-64 sm:h-72 md:h-80 relative">
                                <img src={style.coverImage} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <div className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] md:text-xs font-semibold px-2.5 py-1 md:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                                        <Layers className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                        Более 15 проектов
                                    </div>
                                </div>
                                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                                    <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">{style.name}</h3>
                                    <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">{style.description}</p>
                                    <button className={`w-full py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === style.id ? 'bg-green-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}>
                                        <span className="truncate">{activeTab === style.id ? 'Популярные проекты' : 'Выбрать этот стиль'}</span>
                                        {activeTab === style.id ? <Layers className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Раскрывающийся блок с ТОП-3 планировками для ВАРИАНТА 2 */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <activeStyle.icon className="w-8 h-8 text-green-600" />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Популярные планировки {activeStyle.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Показаны 3 самых востребованных проекта</p>
                            </div>
                        </div>

                        <Link
                            to={`/style/${activeStyle.id}`}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            Смотреть все проекты (15+) <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar">
                        {activeStyle.layouts.map((project, idx) => (
                            <div
                                key={`v2-layout-${project.name}-${idx}`}
                                className={`min-w-[280px] sm:min-w-0 snap-center rounded-2xl bg-white border ${project.popular ? 'border-green-600 shadow-md ring-1 ring-green-600' : 'border-gray-200'} transition-all duration-300 flex flex-col group/card hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className="h-64 overflow-hidden relative rounded-t-2xl bg-gray-100">
                                    {/* Основное фото здания */}
                                    <img 
                                        src={project.images && project.images.length > 1 && project.images[0] === project.image ? project.images[1] : (project.images ? project.images[0] : project.image)} 
                                        alt={project.name} 
                                        className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out group-hover/card:opacity-0" 
                                        loading="lazy" 
                                    />
                                    {/* Планировка (показывается при наведении) */}
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                                        <img 
                                            src={project.image} 
                                            alt={`Планировка ${project.name}`} 
                                            className="max-w-full max-h-full object-contain" 
                                            loading="lazy" 
                                        />
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10 transition-opacity duration-300 group-hover/card:opacity-0">
                                            {project.tags.map((tag, i) => (
                                                <div key={i} className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-md shadow-sm border ${i === 0 ? 'bg-green-600 text-white border-green-500' : 'bg-white/95 text-gray-800 backdrop-blur-md border-gray-200'} `}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col rounded-b-2xl bg-white border-t-0 shadow-sm relative z-20">
                                    <h4 className="text-2xl font-bold font-serif mb-2 text-gray-900 group-hover/card:text-green-700 transition-colors">{project.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700 mb-4 pb-4 border-b border-gray-100">
                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">{project.area}</span>
                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">{project.dimensions}</span>
                                    </div>
                                    <ul className="space-y-2.5 mb-6 flex-1">
                                        {project.features.slice(0, 3).map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-end mt-auto pt-4 bg-gray-50/50 -mx-6 -mb-6 px-6 py-5 rounded-b-2xl border-t border-gray-50">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Цена от</div>
                                            <div className="text-2xl font-display text-gray-900 leading-none">{project.price} ₽</div>
                                        </div>
                                        <Link to={`/project/${project.id}`} className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover/card:bg-green-600 group-hover/card:text-white transition-colors duration-300">
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover/card:-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Кнопка на мобильных внизу для дублирования */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center md:hidden">
                        <Link
                            to={`/style/${activeStyle.id}`}
                            className="text-green-600 font-semibold flex items-center gap-2"
                        >
                            Открыть все планировки {activeStyle.name} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Inject small custom keyframes animation without touching global index.css file */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
