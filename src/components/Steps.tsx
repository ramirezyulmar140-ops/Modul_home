export default function Steps() {
    const steps = [
        {
            num: "01",
            title: "Договор",
            description: "Согласуем планировку и фиксируем цену. Вы вносите предоплату, и мы закупаем материалы."
        },
        {
            num: "02",
            title: "Производство",
            description: "Собираем ваш дом в цеху за 20–30 дней. Вы можете приехать и посмотреть процесс."
        },
        {
            num: "03",
            title: "Фундамент",
            description: "Пока дом строится, мы за 1 день устанавливаем сваи на вашем участке."
        },
        {
            num: "04",
            title: "Монтаж",
            description: "Привозим готовые модули и соединяем их за 48 часов."
        },
        {
            num: "05",
            title: "Сдача",
            description: "Вы проверяете работу, подписываете акт и получаете ключи."
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                        5 шагов до ключей
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Отлаженный процесс, который экономит ваше время и нервы.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-6">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group">
                                {/* Arrow connector for non-last items (visible on lg screens) */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[44px] -right-4 w-8 h-0.5 bg-gray-200 z-0"></div>
                                )}

                                <div className="text-4xl font-black text-green-100 mb-4 group-hover:text-green-200 transition-colors leading-none tracking-tighter">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif relative z-10">{step.title}</h3>
                                <p className="text-sm text-gray-600 relative z-10 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
