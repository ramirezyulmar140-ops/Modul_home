import { Layers, Thermometer, Shield, PaintBucket, Wrench } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Layers className="w-6 h-6 text-green-700" />,
            title: "Каркас",
            description: "Сухая строганная доска камерной сушки с профессиональной огнебиозащитой."
        },
        {
            icon: <Thermometer className="w-6 h-6 text-green-700" />,
            title: "Утепление",
            description: "150–200 мм (Knauf Nord).\nКомфортное проживание даже при −35 °C."
        },
        {
            icon: <Shield className="w-6 h-6 text-green-700" />,
            title: "Защита",
            description: "Стальная мелкоячеистая сетка по всему периметру основания."
        },
        {
            icon: <PaintBucket className="w-6 h-6 text-green-700" />,
            title: "Отделка",
            description: "Натуральные материалы внутри и снаружи.\nФасад с защитой от выцветания до 10 лет."
        },
        {
            icon: <Wrench className="w-6 h-6 text-green-700" />,
            title: "Инженерия",
            description: "Электрощит с автоматами, разводка электрики и воды.\nГотовые выводы под сантехнику."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                        Что <span className="italic text-green-700">уже входит</span> в стоимость
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Никаких доплат за «базовые опции». Мы сдаем дома в честной комплектации «заезжай и живи».
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-5 border border-gray-100">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{feature.title}</h3>
                            <p className="text-gray-600 whitespace-pre-line">{feature.description}</p>
                        </div>
                    ))}

                    <div className="p-6 rounded-2xl bg-green-50 border border-green-100 flex flex-col justify-center items-center text-center">
                        <h3 className="text-xl font-bold text-green-900 mb-2 font-serif">Хотите изменить комплектацию?</h3>
                        <p className="text-green-800 text-sm mb-5">Адаптируем проект под ваши задачи и бюджет.</p>
                        <button className="px-5 py-2.5 bg-white text-green-700 font-medium rounded-lg shadow-sm border border-green-200 hover:bg-green-700 hover:text-white transition-colors w-full">
                            Обсудить проект
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
