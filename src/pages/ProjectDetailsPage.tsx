import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Grid, Maximize, Clock, Layers, Image, LayoutGrid } from 'lucide-react';
import { catalogData, STANDARD_INCLUSIONS, PLYWOOD_INCLUSIONS } from '../data/catalogData';
import { useEffect, useState } from 'react';
import LeadForm2 from '../components/LeadForm2';
import EquipmentSection from '../components/EquipmentSection';
import PricingBreakdown from '../components/PricingBreakdown';
import ExcursionSection from '../components/ExcursionSection';

type ViewMode = 'visual' | 'plan';

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('visual');

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

    const rooms = (targetProject as any)?.rooms || [];
    const images: string[] = (targetProject as any)?.images || (targetProject ? [targetProject.image] : []);
    const floorPlanImage = (targetProject as any)?.floorPlan || targetProject?.image;

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImage(null);
        setViewMode('visual');
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

    // Главное изображение в зависимости от режима
    const mainDisplayImage = viewMode === 'plan' ? floorPlanImage : (activeImage || targetProject.image);

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

            {/* ====== ОБЪЕДИНЁННЫЙ HERO-БЛОК ====== */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-8 md:mb-12">
                    
                    {/* === ЛЕВАЯ КОЛОНКА: Визуал / Планировка === */}
                    <div className="space-y-4">
                        {/* Переключатель режимов */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                            <button 
                                onClick={() => setViewMode('visual')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    viewMode === 'visual' 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Image className="w-4 h-4" /> Визуал
                            </button>
                            <button 
                                onClick={() => setViewMode('plan')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    viewMode === 'plan' 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" /> Планировка
                            </button>
                        </div>

                        {/* Главное изображение */}
                        <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group">
                            <img
                                src={mainDisplayImage}
                                alt={viewMode === 'plan' ? 'Планировка' : targetProject.name}
                                className={`w-full h-full transition-all duration-500 ${
                                    viewMode === 'plan' 
                                        ? 'object-contain p-4' 
                                        : 'object-cover'
                                }`}
                            />
                            {viewMode === 'visual' && targetProject.popular && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] md:text-sm font-bold px-3 py-1 md:px-4 md:py-1.5 uppercase tracking-wider rounded-full shadow-lg z-10">
                                    Популярный выбор
                                </div>
                            )}
                            {viewMode === 'plan' && (
                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-xs font-bold text-gray-600 border border-gray-200">
                                    {targetProject.area}
                                </div>
                            )}
                        </div>

                        {/* Миниатюры (только в режиме визуала) */}
                        {viewMode === 'visual' && images.length > 1 && (
                            <div className="flex overflow-x-auto pb-1 gap-2.5 snap-x">
                                {images.map((img: string, index: number) => (
                                    <div 
                                        key={index}
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all group snap-start
                                            ${(activeImage === img || (!activeImage && index === 0)) ? 'border-green-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Ракурс ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Подсказка в режиме планировки */}
                        {viewMode === 'plan' && (
                            <p className="text-[10px] md:text-sm text-gray-500 italic text-center px-4">
                                * Вы можете запросить подробный файл планировки с размерами у менеджера.
                            </p>
                        )}
                    </div>

                    {/* === ПРАВАЯ КОЛОНКА: Информация + Таблица комнат + Цена === */}
                    <div className="flex flex-col h-full justify-start pt-0 lg:pt-2">
                        {/* Бейджи */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-5">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white font-bold text-xs md:text-sm shadow-lg shadow-accent/20">
                                ✅ Ипотека от 6%
                            </div>
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

                        {/* Название проекта */}
                        <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-3 md:mb-4 tracking-tight">
                            Проект «{targetProject.name}»
                        </h1>

                        {/* Описание */}
                        <p className="text-base md:text-lg text-gray-600 mb-5 md:mb-6 leading-relaxed">
                            {targetProject.description}
                        </p>

                        {/* Характеристики */}
                        <div className="grid grid-cols-2 gap-3 mb-5 md:mb-6">
                            {[
                                { icon: Maximize, label: "Площадь", value: targetProject.area },
                                { icon: Ruler, label: "Габариты", value: targetProject.dimensions },
                                { icon: Layers, label: "Этажность", value: targetProject.floors },
                                { icon: Clock, label: "Срок сборки", value: targetProject.time }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                    <div className="bg-green-50 text-green-600 p-2 rounded-xl flex-shrink-0">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] md:text-xs text-gray-500 font-medium mb-0.5 truncate">{stat.label}</div>
                                        <div className="text-sm md:text-base font-bold text-gray-900 truncate">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Таблица комнат (интегрированная из LayoutSection) */}
                        {rooms.length > 0 ? (
                            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50/30 mb-5 md:mb-6">
                                <div className="px-4 py-3 bg-gray-100/60 border-b border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-green-600" /> Экспликация помещений
                                    </h3>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-gray-100">
                                        {rooms.map((room: { name: string; area: string }, i: number) => (
                                            <tr key={i} className="hover:bg-white transition-colors">
                                                <td className="px-4 py-2.5 text-sm text-gray-800 font-medium">{room.name}</td>
                                                <td className="px-4 py-2.5 text-right text-sm font-bold text-gray-900">{room.area}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-green-50/50">
                                            <td className="px-4 py-2.5 font-bold text-sm text-gray-900">Итого полезная:</td>
                                            <td className="px-4 py-2.5 text-right font-bold text-green-700 text-base">{targetProject.area}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-center mb-5 md:mb-6">
                                <p className="text-sm text-gray-500 italic mb-2">Детальная экспликация помещений готовится по запросу.</p>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">Общая площадь: {targetProject.area}</span>
                            </div>
                        )}

                        {/* Блок цены (скрыт на мобилках — есть липкая панель) */}
                        <div className="hidden md:flex bg-white p-6 lg:p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/5 justify-between items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-bl-full opacity-10 blur-2xl"></div>
                            <div>
                                <div className="mb-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                    Стоимость под ключ
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold font-serif text-gray-900 tracking-tight">
                                    {formattedPrice} <span className="text-xl font-medium text-gray-400">₽</span>
                                </div>
                            </div>
                            <a href="#order-form" className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-xl font-bold text-base text-center transition-all shadow-lg shadow-accent/20 hover:-translate-y-1 relative z-10 flex items-center justify-center gap-2">
                                Получить смету
                            </a>
                        </div>
                    </div>
                </div>

                {/* Баннер "Нужна подробная смета?" — остается под объединённым блоком */}
                <div className="mb-12 md:mb-16 bg-gradient-to-br from-green-600 to-green-700 p-6 md:p-8 rounded-[2rem] text-white flex flex-col sm:flex-row shadow-xl shadow-green-900/10 items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 text-center sm:text-left">
                        <div className="font-bold text-xl mb-1 flex items-center justify-center sm:justify-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Нужна подробная смета?
                        </div>
                        <div className="text-green-100 text-sm opacity-90">Скачайте PDF-презентацию с размерами стен и расстановкой мебели</div>
                    </div>
                    <button className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap relative z-10">
                        Скачать PDF
                    </button>
                </div>

                <EquipmentSection inclusions={inclusions} price={formattedPrice} />
                
                <PricingBreakdown basePrice={formattedPrice} />
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

            {/* Блок с формой связи внизу страницы */}
            <div id="order-form" className="bg-white py-16 border-t border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
                            Понравился проект «{targetProject.name}»?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Оставьте заявку, и мы вышлем вам подробную планировку с актуальной сметой и возможными модификациями.
                        </p>
                    </div>
                    <LeadForm2 />
                </div>
            </div>

            <ExcursionSection />
        </div>
    );
}
