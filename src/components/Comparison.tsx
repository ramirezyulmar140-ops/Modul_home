import { X, Check } from 'lucide-react';

export default function Comparison() {
    const comparison = [
        {
            feature: "Срок строительства",
            modular: "30-45 дней (под ключ)",
            modularGood: true,
            traditional: "6-12 месяцев",
            traditionalGood: false
        },
        {
            feature: "Фиксация цены",
            modular: "Строгая по договору. Вы застрахованы от роста цен на материалы.",
            modularGood: true,
            traditional: "Смета обычно вырастает на 20-40% в процессе стройки.",
            traditionalGood: false
        },
        {
            feature: "Качество сборки",
            modular: "Производство в сухом теплом цеху. Точность до миллиметров.",
            modularGood: true,
            traditional: "Зависит от погоды. Дерево может намокнуть под дождем.",
            traditionalGood: false
        },
        {
            feature: "Участок во время стройки",
            modular: "Чистота. Мы привозим готовые блоки.",
            modularGood: true,
            traditional: "Грязь, строительный мусор, бытовки рабочих на полгода.",
            traditionalGood: false
        },
        {
            feature: "Переезд",
            modular: "Дом можно перевезти на другой участок в будущем.",
            modularGood: true,
            traditional: "Дом навсегда привязан к земле.",
            traditionalGood: null
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="inline-block bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-4 border border-green-100">И это факт</div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6">
                        Зачем ждать год?
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Сравнение заводских модульных домов с традиционным капитальным строительством.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto overflow-x-auto pb-6">
                    <div className="min-w-[700px] px-2">
                        {/* Header */}
                        <div className="grid grid-cols-12 mb-0">
                            <div className="col-span-4"></div>
                            <div className="col-span-4 bg-gradient-to-b from-green-600 to-green-700 text-white p-6 rounded-t-2xl text-center shadow-lg relative z-10 border border-green-500">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm whitespace-nowrap">Разумный выбор</div>
                                <h3 className="font-bold text-xl mb-1 text-white shadow-sm">Наши модульные дома</h3>
                                <p className="text-sm text-green-100 font-medium">Заводская сборка</p>
                            </div>
                            <div className="col-span-4 bg-gray-100/80 text-gray-400 p-6 rounded-t-2xl text-center border-t border-r border-l border-gray-200 mt-2">
                                <h3 className="font-bold text-lg mb-1">Обычная стройка</h3>
                                <p className="text-xs font-medium">Кирпич, пеноблок, сруб</p>
                            </div>
                        </div>

                        {/* Rows */}
                        <div className="bg-white rounded-b-2xl rounded-tl-2xl border border-gray-100 shadow-xl overflow-hidden">
                            {comparison.map((item, idx) => (
                                <div key={idx} className={`grid grid-cols-12 border-b border-gray-100 transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    {/* Feature */}
                                    <div className="col-span-4 p-6 flex flex-col justify-center text-sm font-bold text-gray-800 border-r border-gray-100 uppercase tracking-wide">
                                        {item.feature}
                                    </div>

                                    {/* Modular */}
                                    <div className="col-span-4 p-6 bg-green-50/40 border-r border-green-100/50 relative group">
                                        <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="mt-0.5 bg-white rounded-full p-1 shadow-sm border border-green-100 flex-shrink-0">
                                                {item.modularGood ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <div className="w-5 h-5"></div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 leading-relaxed">{item.modular}</p>
                                        </div>
                                    </div>

                                    {/* Traditional */}
                                    <div className="col-span-4 p-6 bg-gray-50/50 opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-0.5 bg-white rounded-full p-1 shadow-sm border border-gray-200 flex-shrink-0">
                                                {item.traditionalGood === false ? (
                                                    <X className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <div className="w-5 h-5"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">{item.traditional}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
