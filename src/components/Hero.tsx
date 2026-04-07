import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-gray-900 text-white overflow-hidden pt-20">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2600&auto=format&fit=crop"
                    alt="Современный модульный дом в лесу"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 mt-10">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-green-500/30 animate-[fadeIn_0.5s_ease-out]">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        Подходит под льготную ипотеку от 6%
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight mb-8">
                        Готовый дом с <span className="text-green-400">отделкой</span><br /> за 30 дней.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-sans max-w-2xl">
                        От <span className="text-white font-bold font-display">1 290 000 ₽</span>. Заезжайте сразу после монтажа. Фиксированная цена в договоре, без доплат и переплат за материалы.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 animate-[fadeIn_1s_ease-out]">
                        <a href="#catalog" className="bg-green-600 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-green-600/30 hover:bg-green-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
                            Выбрать проект
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <button className="bg-white/10 text-white border border-white/20 backdrop-blur-md font-medium px-8 py-4 rounded-xl hover:bg-white/20 hover:shadow-md transition-all duration-300 flex items-center justify-center">
                            Рассчитать стоимость
                        </button>
                    </div>

                    <div className="mt-16 flex flex-wrap items-center gap-8 text-sm text-gray-300 font-medium animate-[fadeIn_1.2s_ease-out]">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <span>Фиксированная цена</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <span>Ипотека, эскроу</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <span>Гарантия 5 лет</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Inject small custom keyframes animation without touching global index.css file */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
