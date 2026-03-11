import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Ruler, Info, Grid, Maximize, Clock, ShieldCheck, Layers } from 'lucide-react';
import { catalogData } from '../data/catalogData';
import { useEffect, useState } from 'react';
import LeadForm2 from '../components/LeadForm2';

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [selectedConfigIdx, setSelectedConfigIdx] = useState(1); // 0 - Теплый контур, 1 - White Box, 2 - Под ключ

    // Ищем нужный проект и его родительский стиль
    let targetProject = null;
    let targetStyle = null;

    for (const style of catalogData) {
        const found = style.layouts.find(l => l.id === projectId || l.id === projectId?.replace('-mirror', '').replace('-pro', '')); // Учет сгенерированных копий из StyleProjectsPage
        if (found) {
            // Если это копия, имитируем ее данные
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

    const basePrice = targetProject ? parseInt(targetProject.price.replace(/\s+/g, '')) : 0;
    const currentConfig = targetProject?.configurations?.[selectedConfigIdx];
    const totalPrice = currentConfig ? basePrice + currentConfig.priceOffset : basePrice;
    const formattedPrice = totalPrice.toLocaleString('ru-RU');

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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Галерея изображений */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                            <img
                                src={targetProject.image}
                                alt={targetProject.name}
                                className="w-full h-full object-cover"
                            />
                            {targetProject.popular && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-4 py-1.5 uppercase tracking-wider rounded-full shadow-lg z-10">
                                    Хит продаж
                                </div>
                            )}
                        </div>
                        {/* Миниатюры (демо) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm cursor-pointer border-2 border-green-500 opacity-100 transition-all">
                                <img src={targetProject.image} className="w-full h-full object-cover" alt="Thumb 1" />
                            </div>
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm cursor-pointer border-2 border-transparent opacity-70 hover:opacity-100 transition-all">
                                {/* Placeholders for interior */}
                                <img src={targetStyle.coverImage} className="w-full h-full object-cover" alt="Thumb 2" />
                            </div>
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm cursor-pointer border-2 border-transparent opacity-70 hover:opacity-100 transition-all bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-medium z-10 bg-white/90 backdrop-blur-sm shadow-inner rounded-xl m-1">
                                    <Grid className="w-6 h-6 mb-1 text-gray-400" />
                                    План
                                </div>
                                <img src={targetProject.image} className="w-full h-full object-cover blur-sm opacity-50" alt="Thumb 3" />
                            </div>
                        </div>
                    </div>

                    {/* Информация о проекте */}
                    <div className="flex flex-col h-full justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-200 w-fit">
                                Стиль {targetStyle.name}
                            </div>
                            {targetProject.tags?.map((tag: string, i: number) => (
                                <div key={i} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border w-fit
                                    ${i === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white shadow-sm text-gray-600 border-gray-200'}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4">
                            Проект «{targetProject.name}»
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {targetProject.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Maximize className="w-6 h-6" /></div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-0.5">Площадь</div>
                                    <div className="text-lg font-bold text-gray-900">{targetProject.area}</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Ruler className="w-6 h-6" /></div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-0.5">Габариты</div>
                                    <div className="text-lg font-bold text-gray-900">{targetProject.dimensions}</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Layers className="w-6 h-6" /></div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-0.5">Этажность</div>
                                    <div className="text-lg font-bold text-gray-900">{targetProject.floors}</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Clock className="w-6 h-6" /></div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-0.5">Срок сборки</div>
                                    <div className="text-lg font-bold text-gray-900">{targetProject.time}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-600" /> Включено в комплектацию:
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                {targetProject.features.map((feat, i) => (
                                    <li key={i} className="flex gap-3 text-gray-700 items-center">
                                        <div className="bg-green-100 text-green-700 p-1 rounded-full flex-shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium">{feat}</span>
                                    </li>
                                ))}
                                {/* Добавочные пункты для солидности */}
                                <li className="flex gap-3 text-gray-700 items-center">
                                    <div className="bg-green-100 text-green-700 p-1 rounded-full flex-shrink-0">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">Внутренняя отделка</span>
                                </li>
                                <li className="flex gap-3 text-gray-700 items-center">
                                    <div className="bg-green-100 text-green-700 p-1 rounded-full flex-shrink-0">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">Скрытые коммуникации</span>
                                </li>
                            </ul>
                        </div>

                        {targetProject.configurations && (
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Выберите комплектацию:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {targetProject.configurations.map((config: any, idx: number) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedConfigIdx(idx)}
                                            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 ${selectedConfigIdx === idx ? 'border-green-600 bg-green-50 shadow-md transform -translate-y-0.5' : 'border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-bold text-gray-900">{config.name}</div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedConfigIdx === idx ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                                                    {selectedConfigIdx === idx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 line-clamp-3 h-12" title={config.description}>
                                                {config.description}
                                            </div>
                                            <div className="mt-4 font-semibold text-gray-900 bg-white/60 p-2 rounded-lg inline-block border border-gray-100 uppercase text-xs tracking-wider shadow-sm">
                                                {config.priceOffset === 0 ? 'Базовая цена' : `+ ${(config.priceOffset).toLocaleString('ru-RU')} ₽`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/5 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-bl-full opacity-10 blur-2xl"></div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                    Стоимость {currentConfig ? currentConfig.name.toLowerCase() : 'под ключ'} <Info className="w-4 h-4" />
                                </div>
                                <div className="text-4xl md:text-5xl font-display text-gray-900 tracking-tight transition-all duration-300">
                                    {formattedPrice} <span className="text-2xl font-medium text-gray-400">₽</span>
                                </div>
                            </div>
                            <a href="#order-form" className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all shadow-lg shadow-green-600/30 hover:-translate-y-1 hover:shadow-green-600/40 relative z-10 flex items-center justify-center gap-2">
                                Получить смету
                            </a>
                        </div>

                    </div>
                </div>
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
