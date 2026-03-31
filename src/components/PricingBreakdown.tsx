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
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 text-center text-gray-900 tracking-tight">Прозрачный расчет</h2>
                <div className="bg-gray-50 p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    
                    <p className="text-gray-600 mb-10 text-center md:text-left text-lg leading-relaxed relative z-10">
                        Каждый участок уникален, поэтому работы на земле мы вынесли в отдельный, прозрачный прайс. <b className="text-gray-900">Никаких скрытых платежей.</b>
                    </p>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 group">
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Стоимость домокомплекта</span>
                            <span className="font-bold text-gray-900">{basePrice} ₽</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 group">
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Монтаж и сборка на участке</span>
                            <span className="font-bold text-gray-900">+ {installationPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 group">
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Устройство фундамента (сваи)</span>
                            <span className="font-bold text-gray-900">+ {foundationPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 opacity-60">
                            <span className="text-gray-600 italic text-sm">Доставка до участка</span>
                            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full uppercase">Индивидуально</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 opacity-60">
                            <span className="text-gray-600 italic text-sm">Скважина и септик</span>
                            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full uppercase">По желанию</span>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-100 relative z-10">
                        <div className="text-center md:text-left">
                            <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Финальная цена под ключ</div>
                            <div className="text-3xl md:text-4xl font-bold font-serif text-gray-900">{totalPrice} ₽</div>
                        </div>
                        <button className="bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95 w-full md:w-auto">
                            Запросить точную смету
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
