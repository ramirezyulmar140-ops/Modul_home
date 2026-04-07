import { Home, Hammer, Drill, Truck, Droplets, CheckCircle2 } from 'lucide-react';

interface PricingBreakdownProps {
    basePrice: string;
}

export default function PricingBreakdown({ basePrice }: PricingBreakdownProps) {
    const numericBasePrice = parseInt(basePrice.replace(/\s+/g, ''));
    const installationPrice = 80000;
    const foundationPrice = 108000;
    const totalPrice = (numericBasePrice + installationPrice + foundationPrice).toLocaleString('ru-RU');

    return (
        <section className="py-16 md:py-24 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-gray-900 tracking-tight">Прозрачный расчет</h2>
                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                        Мы вынесли работы на участке в отдельный прайс. Вы платите только за то, что действительно нужно. <strong className="text-gray-900">Никаких скрытых платежей.</strong>
                    </p>
                </div>
                
                <div className="bg-gray-50/50 p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="space-y-3 relative z-10 mb-10">
                        {/* Обязательные платежи */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                    <Home className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm md:text-base">Стоимость домокомплекта</div>
                                    <div className="text-xs text-gray-500">Материалы, сборка модулей на производстве</div>
                                </div>
                            </div>
                            <span className="font-bold font-display text-lg md:text-xl text-gray-900 whitespace-nowrap">{basePrice} ₽</span>
                        </div>

                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                    <Hammer className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm md:text-base">Монтаж на участке</div>
                                    <div className="text-xs text-gray-500">Установка модулей, подключение коммуникаций</div>
                                </div>
                            </div>
                            <span className="font-bold font-display text-lg md:text-xl text-gray-900 whitespace-nowrap">+ {installationPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>

                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                    <Drill className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm md:text-base">Свайно-винтовой фундамент</div>
                                    <div className="text-xs text-gray-500">Материалы и работа под ключ</div>
                                </div>
                            </div>
                            <span className="font-bold font-display text-lg md:text-xl text-gray-900 whitespace-nowrap">+ {foundationPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>

                        {/* Опциональные платежи */}
                        <div className="mt-6 pt-6 border-t border-gray-200/60 pb-2 px-2 flex justify-between items-center text-gray-400 opacity-80">
                            <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4" />
                                <span className="text-sm font-medium">Доставка до участка</span>
                            </div>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">Индивидуально</span>
                        </div>
                        <div className="px-2 flex justify-between items-center text-gray-400 opacity-80 pb-4">
                            <div className="flex items-center gap-3">
                                <Droplets className="w-4 h-4" />
                                <span className="text-sm font-medium">Скважина и септик</span>
                            </div>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">По желанию</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-green-950 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="text-center md:text-left relative z-10 w-full md:w-auto">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-green-400 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Финальная цена под ключ</span>
                            </div>
                            <div className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight">{totalPrice} ₽</div>
                        </div>
                        <button onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 text-center relative z-10">
                            Зафиксировать цену
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
