import { MapPin, Calendar, Flame, PenTool } from 'lucide-react';

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-100 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                        Реальные истории наших клиентов
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Дома, которые уже прошли проверку уральской зимой.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Image Side */}
                    <div className="lg:w-5/12 h-64 lg:h-auto relative">
                        <img
                            src="https://images.unsplash.com/photo-1542459955743-34e8f7ae4cdb?auto=format&fit=crop&q=80&w=1200"
                            alt="Уютный модульный дом зимой"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium text-gray-800 flex items-center gap-1.5 shadow-sm">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Верхняя Пышма
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-7/12 p-8 md:p-10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6">
                            Модульный дом «Оптима 45» под ключ
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg text-green-700">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Срок</p>
                                    <p className="text-sm font-medium text-gray-900">24 дня от договора до новоселья.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg text-green-700">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Отопление</p>
                                    <p className="text-sm font-medium text-gray-900">2 800 ₽ в месяц (вторая зима).</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg text-green-700">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Задача</p>
                                    <p className="text-sm font-medium text-gray-900">Сжатый бюджет, заезд до холодов.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg text-green-700">
                                    <span className="flex items-center justify-center w-5 h-5 font-bold text-lg leading-none">0</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Проблемы</p>
                                    <p className="text-sm font-medium text-gray-900">Ни одного гарантийного обращения за 2 года.</p>
                                </div>
                            </div>
                        </div>

                        <blockquote className="border-l-4 border-green-600 pl-5 py-1 mb-6 relative">
                            <p className="text-gray-700 italic relative z-10 text-lg">
                                «Боялись, что цена вырастет, пока строят, как это часто бывает. Но в итоге заплатили ровно столько, сколько было в первом расчёте»
                            </p>
                        </blockquote>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Клиент" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Елена и Максим</p>
                                <p className="text-xs text-gray-500">Владельцы дома «Оптима 45»</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
