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
                                <div className="h-56 overflow-hidden relative rounded-t-2xl bg-gray-100">
                                    <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" loading="lazy" />
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                                            {project.tags.map((tag, i) => (
                                                <div key={i} className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-md shadow-sm border ${i === 0 ? 'bg-green-500 text-white border-green-400' : 'bg-white/95 text-gray-800 backdrop-blur-md border-gray-200'} `}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="text-xl font-bold font-serif mb-2">{project.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">{project.area}</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">{project.dimensions}</span>
                                    </div>
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {project.features.slice(0, 3).map((feat, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-green-600 shrink-0" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-center mt-auto pt-4">
                                        <div className="text-xl font-display text-gray-900">от {project.price} ₽</div>
                                        <Link to={`/project/${project.id}`} className="text-green-700 font-semibold text-sm hover:text-green-800 flex items-center gap-1">
                                            Подробнее <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
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
                                className={`min-w-[280px] sm:min-w-0 snap-center rounded-2xl bg-gray-50 border ${project.popular ? 'border-green-600 shadow-md' : 'border-gray-200'} transition-all duration-300 flex flex-col group/card hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className="h-56 overflow-hidden relative rounded-t-2xl">
                                    <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" loading="lazy" />
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                                            {project.tags.map((tag, i) => (
                                                <div key={i} className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-md shadow-sm border ${i === 0 ? 'bg-green-500 text-white border-green-400' : 'bg-white/95 text-gray-800 backdrop-blur-md border-gray-200'} `}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="text-xl font-bold font-serif mb-2">{project.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                        <span className="bg-gray-200 px-2 py-1 rounded">{project.area}</span>
                                        <span className="bg-gray-200 px-2 py-1 rounded">{project.dimensions}</span>
                                    </div>
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {project.features.slice(0, 3).map((feat, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-green-600 shrink-0" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-center mt-auto pt-4">
                                        <div className="text-xl font-display text-gray-900">от {project.price} ₽</div>
                                        <Link to={`/project/${project.id}`} className="text-green-700 font-semibold text-sm hover:text-green-800 flex items-center gap-1">
                                            Подробнее <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
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
