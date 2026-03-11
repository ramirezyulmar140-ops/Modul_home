export default function Team() {
    return (
        <section className="py-20 bg-emerald-50 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute top-4 -left-4 w-full h-full border-2 border-green-600 rounded-2xl -z-10 bg-white"></div>
                        <img
                            src="https://images.unsplash.com/photo-1541888046422-d81fc1fdd8ba?auto=format&fit=crop&q=80&w=1200"
                            alt="Команда плотников за работой"
                            className="w-full h-[400px] object-cover rounded-2xl shadow-lg relative z-10"
                        />

                        <div className="absolute -bottom-8 -right-8 bg-green-700 text-white p-6 rounded-2xl shadow-xl z-20 max-w-xs outline outline-4 outline-white">
                            <p className="text-3xl font-bold font-serif mb-1">42 дома</p>
                            <p className="text-sm opacity-90">сдали за прошлый год, в которых люди успешно перезимовали.</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                            Строят инженеры, а не «шабашники»
                        </h2>

                        <div className="space-y-6 text-gray-600 font-sans text-lg">
                            <p>
                                Мы — команда инженеров и профессиональных плотников из Екатеринбурга.
                                Мы работаем на <span className="font-semibold text-gray-900">собственном производстве</span> и принципиально не нанимаем случайных людей «с улицы».
                            </p>
                            <p>
                                Наша цель — сделать современную загородную жизнь доступной без кредитов на 30 лет. Мы хотим, чтобы вы наслаждались природой, а не решали проблемы стройки.
                            </p>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <div className="text-center bg-white py-4 px-6 rounded-xl border border-gray-100 flex-1">
                                <p className="text-2xl font-bold text-green-700 font-serif mb-1">2018</p>
                                <p className="text-xs text-gray-500 uppercase font-medium">Год основания</p>
                            </div>
                            <div className="text-center bg-white py-4 px-6 rounded-xl border border-gray-100 flex-1">
                                <p className="text-2xl font-bold text-green-700 font-serif mb-1">32</p>
                                <p className="text-xs text-gray-500 uppercase font-medium">Сотрудника в штате</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
