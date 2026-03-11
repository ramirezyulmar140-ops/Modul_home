import { ShieldCheck, ThermometerSnowflake } from 'lucide-react';

export default function Benefits() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-6">
                        Дом, который не нужно «достраивать»
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Перестаньте переживать о скрытых платежах и бесконечной стройке.
                        Мы берем все риски производства на себя.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Benefit 1 */}
                    <div className="card-premium p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-green-100 transition-all duration-700 ease-out"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-50 rounded-tr-full -z-10 group-hover:scale-150 transition-all duration-700 ease-out"></div>

                        <div className="w-16 h-16 bg-white shadow-md border border-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <ShieldCheck className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif group-hover:text-green-800 transition-colors">Почему у нас дешевле, но надёжнее?</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Мы собираем дом в сухом цеху, а не под дождём. Это исключает гниение дерева и «человеческий фактор».
                            Вы получаете идеальную геометрию стен (погрешность до 1 мм) и <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">экономите 30% бюджета</span>, который при обычной стройке уходит на логистику и аренду спецтехники.
                        </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="card-premium p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-green-100 transition-all duration-700 ease-out"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-50 rounded-tr-full -z-10 group-hover:scale-150 transition-all duration-700 ease-out"></div>

                        <div className="w-16 h-16 bg-white shadow-md border border-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <ThermometerSnowflake className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif group-hover:text-green-800 transition-colors">Уральский климат — не проблема</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Толщина утеплителя рассчитана на морозы до -40°C. В базе — энергоэффективные окна и защита от грызунов.
                            В модуле <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">уже разведена электрика</span>, установлены розетки и сантехника. Вам остаётся только занести мебель.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
