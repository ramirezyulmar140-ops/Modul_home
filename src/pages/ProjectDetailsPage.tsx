import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Ruler, Grid, Maximize, Clock, Layers, Package } from 'lucide-react';
import { catalogData, STANDARD_INCLUSIONS, PLYWOOD_INCLUSIONS } from '../data/catalogData';
import { useEffect, useState } from 'react';
import LeadForm2 from '../components/LeadForm2';

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [activeImage, setActiveImage] = useState<string | null>(null);

    // Ищем нужный проект и его родительский стиль
    let targetProject = null;
    let targetStyle = null;

    for (const style of catalogData) {
        const found = style.layouts.find(l => l.id === projectId || l.id === projectId?.replace('-mirror', '').replace('-pro', ''));
        if (found) {
            if (projectId?.includes('-mirror')) {
                targetProject = { ...found, name: found.name + ' (Зеркальный)', id: projectId, price: (parseInt(found.price.replace(/\s+/g, '')) + 100000).toLocaleString('ru-RU') };
            } else if (projectId?.includes('-pro')) {
                targetProject = { ...found, name: found.name + ' Pro', id: projectId, price: (parseInt(found.price.replace(/\s+/g, '')) + 350000).toLocaleString('ru-RU'), features: [...found.features, 'Умный дом'] };
            } else {
                targetProject = found;
            }
            targetStyle = style;
            break;
        }
    }

    const formattedPrice = targetProject ? parseInt(targetProject.price.replace(/\s+/g, '')).toLocaleString('ru-RU') : '0';
    // Определяем нужный набор комплектации
    const inclusions = targetStyle?.id === 'plywood' ? PLYWOOD_INCLUSIONS : STANDARD_INCLUSIONS;

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImage(null);
    }, [projectId]);

    if (!targetProject || !targetStyle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Проект не найден</h1>
                    <Link to="/#catalog" className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-0">
            {/* Навигация */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <Link to={`/style/${targetStyle.id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Все проекты {targetStyle.name}</span>
                        <span className="sm:hidden">Назад</span>
                    </Link>
                    <div className="text-sm font-semibold text-gray-900 truncate px-4">
                        {targetProject.name}
                    </div>
                    <a href="#order-form" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-500 transition-colors shadow-sm">
                        Заказать
                    </a>
                </div>
            </div>

            {/* Главный блок проекта */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12 md:mb-16">
                    
                    {/* Секция планировки (первая) */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Grid className="w-5 h-5 md:w-6 md:h-6 text-green-600" /> Планировка
                            </h2>
                            <div className="text-xs md:text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                {targetProject.area}
                            </div>
                        </div>
                        <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group cursor-zoom-in">
                            <img
                                src={(targetProject as any).floorPlan || targetProject.image}
                                alt="Планировка"
                                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 md:group-hover:opacity-100">
                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-900">
                                    Увеличить план
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-sm text-gray-500 italic text-center px-4">
                            * Вы можете запросить подробный файл планировки с размерами у менеджера.
                        </p>
                    </div>

                    {/* Информация о проекте */}
                    <div className="flex flex-col h-full justify-start pt-0 lg:pt-2">
                        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm border border-gray-200">
                                Стиль {targetStyle.name}
                            </div>
                            {targetProject.tags?.map((tag: string, i: number) => (
                                <div key={i} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border
                                    ${i === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white shadow-sm text-gray-600 border-gray-200'}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-3 md:mb-4">
                            Проект «{targetProject.name}»
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                            {targetProject.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                            {[
                                { icon: Maximize, label: "Площадь", value: targetProject.area },
                                { icon: Ruler, label: "Габариты", value: targetProject.dimensions },
                                { icon: Layers, label: "Этажность", value: targetProject.floors },
                                { icon: Clock, label: "Срок сборки", value: targetProject.time }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4">
                                    <div className="bg-green-50 text-green-600 p-2 md:p-3 rounded-xl flex-shrink-0">
                                        <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] md:text-sm text-gray-500 font-medium mb-0.5 truncate">{stat.label}</div>
                                        <div className="text-sm md:text-lg font-bold text-gray-900 truncate">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Блок цены (скрыт на мобилках в этом месте, так как есть липкая панель) */}
                        <div className="hidden md:flex bg-white p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/5 justify-between items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-bl-full opacity-10 blur-2xl"></div>
                            <div>
                                <div className="mb-2 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                    Стоимость под ключ
                                </div>
                                <div className="text-4xl lg:text-5xl font-display text-gray-900 tracking-tight">
                                    {formattedPrice} <span className="text-2xl font-medium text-gray-400">₽</span>
                                </div>
                            </div>
                            <a href="#order-form" className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all shadow-lg shadow-green-600/30 hover:-translate-y-1 hover:shadow-green-600/40 relative z-10 flex items-center justify-center gap-2">
                                Получить смету
                            </a>
                        </div>
                    </div>
                </div>

                {/* Вторая секция: Галерея визуалов */}
                <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
                    <div className="flex items-center gap-3">
                        <div className="h-6 md:h-8 w-1.5 bg-green-600 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Галерея визуалов</h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
                        {/* Главное фото в галерее */}
                        <div className="lg:col-span-8 order-1">
                            <div className="aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl relative bg-gray-200">
                                <img
                                    src={activeImage || targetProject.image}
                                    alt={targetProject.name}
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                                {targetProject.popular && (
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] md:text-sm font-bold px-3 py-1 md:px-4 md:py-1.5 uppercase tracking-wider rounded-full shadow-lg z-10">
                                        Популярный выбор
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Миниатюры */}
                        <div className="lg:col-span-4 flex flex-col gap-4 order-2">
                            <div className="text-[10px] md:text-sm font-bold text-gray-900 uppercase tracking-widest mb-1 opacity-60">Ракурсы проекта</div>
                            {/* На мобилках делаем горизонтальный скролл, на десктопе - сетку */}
                            <div className="flex overflow-x-auto pb-2 gap-3 snap-x lg:snap-none lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible">
                                {((targetProject as any).images || [targetProject.image]).map((img: string, index: number) => (
                                    <div 
                                        key={index}
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-24 h-24 md:w-auto md:h-auto md:aspect-square rounded-2xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all group snap-start
                                            ${(activeImage === img || (!activeImage && index === 0)) ? 'border-green-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Thumb ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Секция комплектации */}
                <div className="mb-20 md:mb-16">
                    <div className="bg-white rounded-[2rem] p-6 md:p-12 border border-gray-100 shadow-sm">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                            <Package className="w-6 h-6 md:w-8 md:h-8 text-green-600" /> Комплектация «Под ключ»
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {inclusions.map((section, si) => (
                                <div key={si} className="bg-gray-50/50 rounded-2xl p-5 md:p-6 border border-gray-100">
                                    <div className="text-[10px] md:text-[11px] font-black text-green-700 uppercase tracking-widest mb-3 md:mb-4 inline-block px-2 py-0.5 md:py-1 bg-green-100 rounded">
                                        {section.category}
                                    </div>
                                    <ul className="space-y-2 md:space-y-3">
                                        {section.items.map((item, ii) => (
                                            <li key={ii} className="flex gap-2.5 md:gap-3 text-gray-700 items-start">
                                                <div className="bg-green-600 text-white p-0.5 rounded-full flex-shrink-0 mt-1">
                                                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                </div>
                                                <span className="text-xs md:text-sm leading-relaxed font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 md:mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-3">
                            <div className="text-yellow-600 font-bold">!</div>
                            <p className="text-[11px] md:text-sm text-yellow-800 leading-relaxed font-medium uppercase md:normal-case">
                                <strong>Важно:</strong> Выбор конкретных отделочных материалов осуществляется после заключения договора.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Липкая нижняя панель для мобильных устройств */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Цена под ключ</div>
                    <div className="text-xl font-bold text-gray-900">{formattedPrice} ₽</div>
                </div>
                <button 
                    onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
                >
                    Получить смету
                </button>
            </div>

            {/* Блок с формой связи внизу страницы (чтобы не уходить на главную) */}
            <div id="order-form" className="bg-white py-16 border-t border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
                            Понравился проект «{targetProject.name}»?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Оставьте заявку, и мы вышлем вам подробную планировку с актуальной сметой и возможными модификациями.
                        </p>
                    </div>
                    <LeadForm2 />
                </div>
            </div>
        </div>
    );
}
