import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white text-gray-900 pt-24 pb-16 lg:pt-32 lg:pb-32">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-50 opacity-50 blur-3xl"></div>
                <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-emerald-50 opacity-50 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
                            Готовый дом в Екатеринбурге за <span className="text-green-700 italic">30 дней</span>:<br /> от <span className="font-display">890 000 ₽</span> с отделкой.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl font-sans">
                            Заезжайте сразу после монтажа. Цена фиксируется в договоре и не растёт в процессе. Экономия <span className="font-display">320 000 ₽</span> за счёт заводской сборки — без переплат за стройматериалы и переделки.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_1s_ease-out]">
                            <button className="btn-primary flex items-center justify-center">
                                Узнать стоимость дома с доставкой
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="btn-outline flex items-center justify-center text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-700">
                                Скачать каталог проектов
                            </button>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium animate-[fadeIn_1.2s_ease-out]">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 shadow-sm border border-green-200">✓</span>
                                Фиксированная цена в договоре
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 shadow-sm border border-green-200">✓</span>
                                Ипотека, эскроу, маткапитал
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 shadow-sm border border-green-200">✓</span>
                                От фундамента до инженерии
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-[fadeIn_1.5s_ease-out]">
                        {/* Using a placeholder aesthetic image showing a bright modern cabin in nature */}
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img
                                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2600&auto=format&fit=crop"
                                alt="Современный модульный дом в лесу"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80"></div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="glass-effect p-5 rounded-xl border border-white/30 inline-block transform hover:-translate-y-1 transition-transform cursor-default">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Срок установки</p>
                                    <p className="text-xl font-bold font-serif text-gray-900">от 1 до 3 дней</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-700/10 rounded-full blur-2xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
