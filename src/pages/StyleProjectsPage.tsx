import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { catalogData } from '../data/catalogData';
import { useEffect } from 'react';

export default function StyleProjectsPage() {
    const { styleId } = useParams();
    const styleData = catalogData.find(s => s.id === styleId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!styleData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Стиль не найден</h1>
                    <Link to="/" className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Вернуться на главную
                    </Link>
                </div>
            </div>
        );
    }

    // Для демонстрации "множества планировок", продублируем существующие, 
    // чтобы их казалось больше (например, 9 штук вместо 3)
    const allProjects = [
        ...styleData.layouts,
        ...styleData.layouts.map(l => ({ ...l, name: l.name + ' (Зеркальный)', price: (parseInt(l.price.replace(/\s+/g, '')) + 100000).toLocaleString('ru-RU') })),
        ...styleData.layouts.map(l => ({ ...l, name: l.name + ' Pro', price: (parseInt(l.price.replace(/\s+/g, '')) + 350000).toLocaleString('ru-RU'), features: [...l.features, 'Умный дом'] }))
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Навигация */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/#catalog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад в каталог</span>
                    </Link>
                </div>
            </div>

            {/* Шапка стиля */}
            <div className="relative h-80 md:h-[400px] overflow-hidden">
                <img
                    src={styleData.coverImage}
                    alt={styleData.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 w-full">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="max-w-3xl text-white">
                            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 flex items-center gap-4">
                                <styleData.icon className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
                                {styleData.name}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                                {styleData.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Список всех проектов */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Доступные планировки <span className="text-gray-400 font-medium">({allProjects.length})</span>
                    </h2>

                    {/* Заглушка для фильтров */}
                    <div className="flex gap-2">
                        <select className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:border-green-500">
                            <option>По площади (возрастание)</option>
                            <option>По площади (убывание)</option>
                            <option>Сначала дешевле</option>
                            <option>Сначала дороже</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allProjects.map((project, idx) => (
                        <div
                            key={`${project.name}-${idx}`}
                            className={`rounded-2xl bg-white border ${project.popular ? 'border-green-600 shadow-lg shadow-green-900/10' : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'} transition-all duration-300 relative flex flex-col group`}
                            style={{ animation: 'fadeIn 0.5s ease-out backwards', animationDelay: `${(idx % 6) * 100}ms` }}
                        >
                            {project.popular && (
                                <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wider rounded-full shadow-md z-30">
                                    Хит продаж
                                </div>
                            )}

                            <div className="h-64 overflow-hidden relative rounded-t-2xl">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-semibold px-2 py-1 rounded border border-white/20 uppercase tracking-wider">
                                        {project.type}
                                    </span>
                                </div>
                                <div className="absolute bottom-5 left-5 text-white pr-4 w-full">
                                    <h3 className="text-2xl font-bold font-serif mb-3 tracking-wide">{project.name}</h3>
                                    <div className="flex flex-wrap gap-2 text-xs font-medium opacity-90">
                                        <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">{project.area}</span>
                                        <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">{project.dimensions}</span>
                                        <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">{project.floors}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 rounded-b-2xl">
                                <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-100/80 flex-1 leading-relaxed">
                                    {project.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {project.features.map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-700 items-start">
                                            <div className="mt-0.5 bg-green-50 p-1 rounded-full text-green-600 flex-shrink-0 border border-green-100">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-medium text-gray-800">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-end mb-5">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                                Стоимость <Info className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="text-2xl font-display text-gray-900 tracking-tight">
                                                от {project.price} <span className="text-lg font-medium text-gray-500">₽</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/project/${project.id}`} className="w-full py-4 px-6 flex items-center justify-center text-center rounded-lg font-semibold transition-all duration-300 translate-y-0 group-hover:-translate-y-0.5 shadow-sm hover:shadow-md bg-white text-gray-900 border border-gray-200 hover:border-green-600 hover:text-green-700 shadow-gray-200/50">
                                        Смотреть проект
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div >
    );
}
