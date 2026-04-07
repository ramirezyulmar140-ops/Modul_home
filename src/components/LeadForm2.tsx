import { ArrowRight, Phone } from 'lucide-react';

export default function LeadForm2() {
    return (
        <section className="py-24 bg-gradient-to-br from-green-900 to-gray-900 relative">
            <div className="absolute inset-0 z-0 opacity-20 MixBlendMode">
                <img
                    src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000"
                    alt="Forest background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-green-950/80 mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl">

                    {/* Content */}
                    <div className="p-10 md:p-14 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-6 leading-tight">
                            Не откладывайте переезд на <span className="italic text-green-300">следующий год.</span>
                        </h2>
                        <p className="text-green-50/80 mb-8 font-sans leading-relaxed">
                            Забронируйте цену сегодня, чтобы зафиксировать стоимость материалов до сезонного подорожания. Оставьте заявку на бесплатный выезд инженера для оценки участка.
                        </p>

                        <div className="flex items-center text-white gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner">
                                <Phone className="w-5 h-5 text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-green-100/70 mb-0.5">Или позвоните нам</p>
                                <p className="text-xl font-bold font-serif tracking-wide">+7 (343) 200-00-00</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-10 md:p-14 md:w-1/2 bg-white flex flex-col justify-center">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Зафиксировать цену</h3>
                            <p className="text-gray-500 text-sm">Мы перезвоним вам в течение 10 минут</p>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="final-name" className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                                <input
                                    type="text"
                                    id="final-name"
                                    placeholder="Александр"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-gray-50 font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="final-phone" className="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
                                <input
                                    type="tel"
                                    id="final-phone"
                                    placeholder="+7 (999) 000-00-00"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-gray-50 font-medium"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 group"
                            >
                                <span>Забронировать цену</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Нажимая на кнопку, вы соглашаетесь с условиями <a href="#" className="underline">обработки персональных данных</a>.
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
