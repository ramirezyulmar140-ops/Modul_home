import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Grid, Maximize, Clock, Layers } from 'lucide-react';
import { catalogData, STANDARD_INCLUSIONS, PLYWOOD_INCLUSIONS } from '../data/catalogData';
import { useEffect, useState } from 'react';
import LeadForm2 from '../components/LeadForm2';
import EquipmentSection from '../components/EquipmentSection';
import PricingBreakdown from '../components/PricingBreakdown';
import ExcursionSection from '../components/ExcursionSection';

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [activeImage, setActiveImage] = useState<string | null>(null);

    interface Room {
        name: string;
        area: string;
    }

    interface Layout {
        id: string;
        name: string;
        type: string;
        area: string;
        dimensions: string;
        floors: string;
        time: string;
        price: string;
        description: string;
        image: string;
        images?: string[];
        floorPlan?: string;
        features: string[];
        popular?: boolean;
        tags?: string[];
        rooms?: Room[];
    }

    interface Style {
        id: string;
        name: string;
        layouts: Layout[];
    }

    // Ищем нужный проект и его родительский стиль
    let targetProject: Layout | null = null;
    let targetStyle: Style | null = null;

    for (const style of (catalogData as unknown as Style[])) {
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

    const rooms = targetProject?.rooms || [];
    const images: string[] = targetProject?.images || (targetProject ? [targetProject.image] : []);
    const floorPlanImage = (targetProject?.floorPlan || targetProject?.image) || undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
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
        <div key={projectId} className="min-h-screen bg-gray-50 pb-0">
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

            {/* ====== ОБЪЕДИНЁННЫЙ HERO-БЛОК (Double Hero) ====== */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* AIRBNB-STYLE GALLERY HEADER */}
                <div className="mb-6 md:mb-10">
                    {/* Заголовок проекта (перенесен наверх перед галереей) */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Стиль {targetStyle.name}</span>
                                {targetProject.popular && <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">ХИТ ПРОДАЖ</span>}
                                {targetProject.tags?.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 tracking-tight">Проект «{targetProject.name}»</h1>
                        </div>
                    </div>

                    {/* Сетка фотографий */}
                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        {/* Главное фото (слева) */}
                        <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => setActiveImage(images[0] || targetProject.image)}>
                            <img src={images[0] || targetProject.image} alt="Главный вид" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        {/* Правая секция миниатюр */}
                        {Array.from({ length: 4 }).map((_, i) => {
                            const imgIndex = (i + 1) % images.length;
                            const imgSrc = images[imgIndex] || targetProject.image;
                            return (
                                <div key={i} className={`hidden md:block relative group cursor-pointer overflow-hidden`} onClick={() => setActiveImage(imgSrc)}>
                                    <img src={imgSrc} alt={`Ракурс ${i+2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Основной контент */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 relative items-start">
                    
                    {/* === ЛЕВАЯ КОЛОНКА: Описание, статы, комнаты === */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Описание */}
                        <section>
                            <h2 className="text-2xl font-bold font-serif mb-4 text-gray-900">О проекте</h2>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                {targetProject.description} Идеально подходит для круглогодичного проживания. Модульная технология позволяет произвести монтаж за считанные дни без строительного мусора на участке.
                            </p>
                        </section>

                        {/* Характеристики */}
                        <section>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Maximize, label: "Площадь", value: targetProject.area },
                                    { icon: Ruler, label: "Габариты", value: targetProject.dimensions },
                                    { icon: Layers, label: "Этажность", value: targetProject.floors },
                                    { icon: Clock, label: "Сборка", value: targetProject.time }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                        <div className="bg-green-50 text-green-600 p-3 rounded-2xl mb-3">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium mb-1">{stat.label}</div>
                                        <div className="text-base font-bold text-gray-900">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Планировка с переключением режима в ней */}
                        <section>
                            <h2 className="text-2xl font-bold font-serif mb-6 text-gray-900">Планировочное решение</h2>
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="md:w-1/2 w-full bg-gray-50 rounded-2xl p-4 aspect-square flex items-center justify-center border border-gray-100 relative group cursor-pointer" onClick={() => setActiveImage(floorPlanImage || null)}>
                                        <img src={floorPlanImage} alt="Планировка" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                                        <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow backdrop-blur-sm text-gray-600 group-hover:text-green-600 transition-colors">
                                            <Maximize className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 w-full">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Grid className="w-5 h-5 text-green-600" /> Экспликация помещений
                                        </h3>
                                        {rooms.length > 0 ? (
                                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                <table className="w-full text-left">
                                                    <tbody className="divide-y divide-gray-200">
                                                        {rooms.map((room, i) => (
                                                            <tr key={i} className="hover:bg-white transition-colors">
                                                                <td className="px-4 py-3 text-sm text-gray-700">{room.name}</td>
                                                                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{room.area}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-green-50/50">
                                                            <td className="px-4 py-3 font-bold text-sm text-gray-900">Итого:</td>
                                                            <td className="px-4 py-3 text-right font-bold text-green-700">{targetProject.area}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-sm">Детальная экспликация комнат предоставляется по запросу.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* === ПРАВАЯ КОЛОНКА: Стики-виджет цены === */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
                            <div className="mb-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Итоговая стоимость от</p>
                                <div className="text-4xl font-display font-bold text-gray-900 leading-none">
                                    {formattedPrice} <span className="text-2xl text-gray-400 font-medium">₽</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Комплектация: Теплый контур</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Ипотека: Семейная от 6%
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Срок службы: более 50 лет
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Расширенная гарантия 5 лет!
                                </li>
                            </ul>

                            <button onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98] flex justify-center items-center gap-2 text-lg mb-3">
                                Получить точную смету
                            </button>
                            
                            <p className="text-xs text-center text-gray-400">
                                Пришлем на WhatsApp в течение 5 минут. Это бесплатно.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Модалка галереи */}
                {activeImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setActiveImage(null)}>
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={() => setActiveImage(null)}>
                            ✕ Закрыть
                        </button>
                        <img src={activeImage} alt="Fullscreen View" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
                    </div>
                )}

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
