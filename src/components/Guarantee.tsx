import { ShieldCheck, Lock, Activity, Factory, ArrowRight } from 'lucide-react';

export default function Guarantee() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                        Гарантии: Спокойствие на годы
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Мы строим дома, за которые не стыдно. Строим под ключ: берем на себя все этапы от фундамента до инженерных сетей. Все обязательства зафиксированы в договоре.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center group">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Гарантия 7 лет по договору</h3>
                        <p className="text-gray-600 text-sm leading-relaxed px-4">
                            Ваш дом не перекосит и не поведёт. Мы используем только сухую строганую доску камерной сушки и строго соблюдаем технологию.
                        </p>
                    </div>

                    <div className="text-center group">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                            <Lock className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Фиксация сметы</h3>
                        <p className="text-gray-600 text-sm leading-relaxed px-4">
                            Если в процессе работы дорожает дерево или металл — это наши расходы, а не ваши.
                        </p>
                    </div>

                    <div className="text-center group">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                            <Activity className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Собственный сервис</h3>
                        <p className="text-gray-600 text-sm leading-relaxed px-4">
                            Своя мобильная сервисная служба. Если во время эксплуатации возникнут вопросы — мы оперативно приедем и решим их.
                        </p>
                    </div>
                </div>

                {/* --- Блок: Экскурсия на производство --- */}
                <div className="mt-24 max-w-5xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        {/* Декоративные элементы */}
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 text-center md:text-left text-white">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-300 font-semibold text-xs uppercase tracking-wider mb-6 border border-white/20">
                                    <Factory className="w-4 h-4" />
                                    Приглашаем в гости
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4">
                                    Лучше один раз увидеть!
                                </h3>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
                                    Запишитесь на экскурсию на наше производство или посетите готовые дома. Покажем, как сушится доска, собираются каркасы и почему наши дома служат десятилетиями.
                                </p>
                            </div>

                            <div className="shrink-0 w-full md:w-auto">
                                <button className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 group">
                                    Записаться на экскурсию
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-gray-400 text-xs text-center mt-4">
                                    Это бесплатно и ни к чему не обязывает
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
