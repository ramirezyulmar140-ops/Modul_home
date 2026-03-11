import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Home, Wrench, Key } from 'lucide-react';

type PackageType = 'warm' | 'whitebox' | 'turnkey';

export default function CostCalculator() {
    const [area, setArea] = useState(45);
    const [packageType, setPackageType] = useState<PackageType>('turnkey');
    const [hasTerrace, setHasTerrace] = useState(false);
    const [hasFoundation, setHasFoundation] = useState(false);
    const [distance, setDistance] = useState(20);
    const [totalPrice, setTotalPrice] = useState(0);

    // New Options
    const [hasSeptic, setHasSeptic] = useState(false);
    const [hasWarmFloor, setHasWarmFloor] = useState(false);

    // Pricing logic
    const PRICES = {
        warm: 35000,
        whitebox: 55000,
        turnkey: 65000
    };

    const TERRACE_PRICE = 150000;
    const FOUNDATION_PRICE_SQM = 3000;
    const DELIVERY_PRICE_KM = 300;
    const SEPTIC_PRICE = 150000;
    const WARM_FLOOR_PRICE_SQM = 1800;

    useEffect(() => {
        let price = area * PRICES[packageType];
        if (hasTerrace) price += TERRACE_PRICE;
        if (hasFoundation) price += area * FOUNDATION_PRICE_SQM;
        if (hasSeptic) price += SEPTIC_PRICE;
        if (hasWarmFloor) price += area * WARM_FLOOR_PRICE_SQM;
        price += distance * DELIVERY_PRICE_KM;

        setTotalPrice(price);
    }, [area, packageType, hasTerrace, hasFoundation, hasSeptic, hasWarmFloor, distance]);

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return (
        <section id="configurator" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">


                <div
                    className="max-w-6xl mx-auto rounded-3xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row"
                    style={{
                        background: 'linear-gradient(0.375turn,rgba(220,226,226,1) 0%,rgba(247,247,247,1) 34%,rgba(248,248,248,1) 67%,rgba(210,217,216,1) 100%)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                    }}
                >

                    {/* Left: Controls */}
                    <div className="p-8 md:p-10 lg:w-3/5 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Параметры и комплектация</h3>
                                <p className="text-sm text-gray-500">Настройте дом под ваши нужды</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Area Slider */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Жилая площадь</label>
                                    <span className="text-2xl font-bold text-green-700">{area} м²</span>
                                </div>
                                <input
                                    type="range"
                                    min="20" max="150" step="5"
                                    value={area}
                                    onChange={(e) => setArea(Number(e.target.value))}
                                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-green-600 border border-gray-200 shadow-inner"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>20 м² (Студия)</span>
                                    <span>150 м² (Большой дом)</span>
                                </div>
                            </div>

                            {/* Packages */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Комплектация</label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setPackageType('warm')}
                                        className={`relative p-5 rounded-2xl border-2 text-left transition-all ${packageType === 'warm' ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                                    >
                                        <Home className={`w-6 h-6 mb-3 ${packageType === 'warm' ? 'text-green-600' : 'text-gray-400'}`} />
                                        <h4 className={`font-serif text-xl font-bold mb-1 ${packageType === 'warm' ? 'text-green-900' : 'text-gray-900'}`}>Базовая</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">Стандартные отделочные материалы и базовый комплект коммуникаций.</p>
                                    </button>

                                    <button
                                        onClick={() => setPackageType('whitebox')}
                                        className={`relative p-5 rounded-2xl border-2 text-left transition-all ${packageType === 'whitebox' ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                                    >
                                        <Wrench className={`w-6 h-6 mb-3 ${packageType === 'whitebox' ? 'text-green-600' : 'text-gray-400'}`} />
                                        <h4 className={`font-serif text-xl font-bold mb-1 ${packageType === 'whitebox' ? 'text-green-900' : 'text-gray-900'}`}>Стандарт +</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">Улучшенные отделочные материалы и расширенный комплект коммуникаций.</p>
                                    </button>

                                    <button
                                        onClick={() => setPackageType('turnkey')}
                                        className={`relative p-5 rounded-2xl border-2 text-left transition-all overflow-hidden ${packageType === 'turnkey' ? 'border-green-600 bg-green-50/50 shadow-md ring-1 ring-green-600' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                                    >
                                        {packageType === 'turnkey' && (
                                            <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                ХИТ
                                            </div>
                                        )}
                                        <Key className={`w-6 h-6 mb-3 ${packageType === 'turnkey' ? 'text-green-600' : 'text-gray-400'}`} />
                                        <h4 className={`font-serif text-xl font-bold mb-1 ${packageType === 'turnkey' ? 'text-green-900' : 'text-gray-900'}`}>Комфорт</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">Премиальные отделочные материалы и полный комплект инженерных решений.</p>
                                    </button>
                                </div>
                            </div>

                            {/* Additional Options */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Дополнительные опции</label>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Foundation */}
                                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${hasFoundation ? 'border-green-600 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            id="foundation"
                                            checked={hasFoundation}
                                            onChange={(e) => setHasFoundation(e.target.checked)}
                                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                                        />
                                        <div>
                                            <span className={`block font-bold ${hasFoundation ? 'text-green-900' : 'text-gray-900'}`}>Свайно-винтовой фундамент</span>
                                            <span className="text-xs text-gray-500">Рассчитывается от площади дома</span>
                                        </div>
                                    </label>

                                    {/* Terrace */}
                                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${hasTerrace ? 'border-green-600 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            id="terrace"
                                            checked={hasTerrace}
                                            onChange={(e) => setHasTerrace(e.target.checked)}
                                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                                        />
                                        <div>
                                            <span className={`block font-bold ${hasTerrace ? 'text-green-900' : 'text-gray-900'}`}>Терраса 15 м²</span>
                                            <span className="text-xs text-gray-500">+ {formatPrice(TERRACE_PRICE)} ₽</span>
                                        </div>
                                    </label>

                                    {/* Warm Floor */}
                                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${hasWarmFloor ? 'border-green-600 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            id="warmFloor"
                                            checked={hasWarmFloor}
                                            onChange={(e) => setHasWarmFloor(e.target.checked)}
                                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                                        />
                                        <div>
                                            <span className={`block font-bold ${hasWarmFloor ? 'text-green-900' : 'text-gray-900'}`}>Теплый пол</span>
                                            <span className="text-xs text-gray-500">+ {formatPrice(WARM_FLOOR_PRICE_SQM)} ₽ за м²</span>
                                        </div>
                                    </label>

                                    {/* Septic */}
                                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${hasSeptic ? 'border-green-600 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            id="septic"
                                            checked={hasSeptic}
                                            onChange={(e) => setHasSeptic(e.target.checked)}
                                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                                        />
                                        <div>
                                            <span className={`block font-bold ${hasSeptic ? 'text-green-900' : 'text-gray-900'}`}>Септик</span>
                                            <span className="text-xs text-gray-500">+ {formatPrice(SEPTIC_PRICE)} ₽</span>
                                        </div>
                                    </label>
                                </div>
                            </div>



                            {/* Distance Slider */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Доставка (от производства)</label>
                                    <span className="text-lg font-bold text-gray-900">{distance} км</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="300" step="10"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Result & Form */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-gray-900 to-green-950 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative background lines */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        <div className="relative z-10 flex-1 flex flex-col pt-4">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Предварительный расчет</p>
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-5xl font-display tabular-nums tracking-tight leading-none">{formatPrice(totalPrice)}</span>
                                    <span className="text-2xl font-serif text-green-400 leading-none mt-1">₽</span>
                                </div>

                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span>Площадь: {area} м²</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span>Комплектация: {packageType === 'warm' ? 'Базовая' : packageType === 'whitebox' ? 'Стандарт +' : 'Комфорт'}</span>
                                </div>

                                {(hasTerrace || hasFoundation || hasWarmFloor || hasSeptic) && (
                                    <div className="flex items-start gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span>Доп. опции: {[
                                            hasFoundation && 'Фундамент',
                                            hasTerrace && 'Терраса',
                                            hasWarmFloor && 'Теплый пол',
                                            hasSeptic && 'Септик',
                                        ].filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span>Доставка: {distance} км</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-10">
                                <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-900 relative z-20">
                                    <h4 className="font-bold text-lg mb-2">Понравилась цена?</h4>
                                    <p className="text-sm text-gray-600 mb-5">Зафиксируйте её и получите детальную смету на выбранную конфигурацию.</p>

                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Номер (WhatsApp / Telegram)"
                                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm font-medium"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 group"
                                        >
                                            <span>Получить точную смету</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Пришлем в течение 5 минут</p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
