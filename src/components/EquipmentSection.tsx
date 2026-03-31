import { Check } from 'lucide-react';

interface InclusionItem {
    category: string;
    items: string[];
}

interface EquipmentSectionProps {
    inclusions: InclusionItem[];
    price: string;
}

export default function EquipmentSection({ inclusions, price }: EquipmentSectionProps) {
    return (
        <section id="feature-equipment" className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-center mb-4 text-gray-900">Всё включено в базовую комплектацию</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                    Мы не экономим на материалах. В стоимость <span className="font-bold text-gray-900">{price} ₽</span> уже входит полностью готовая внутренняя и внешняя отделка, электрика и сантехника.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {inclusions.map((section, idx) => (
                        <div key={idx} className="card-premium p-6 md:p-8 flex flex-col h-full bg-white rounded-3xl border border-gray-100 hover:border-green-200 transition-all shadow-sm hover:shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <h3 className="font-bold font-serif text-lg md:text-xl text-gray-900 uppercase tracking-tight">
                                    {section.category}
                                </h3>
                            </div>
                            
                            <ul className="space-y-3 flex-grow">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm md:text-base text-gray-600 leading-tight group-hover:text-gray-900 transition-colors">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 bg-white p-6 rounded-2xl border border-yellow-100 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-yellow-50 text-yellow-600 flex items-center justify-center rounded-full flex-shrink-0 font-bold">!</div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                        <b>Важно:</b> Выбор конкретных отделочных материалов (цвета, текстуры) осуществляется на этапе согласования договора. Мы используем только сертифицированные материалы камерной сушки и ГОСТ-инженерию.
                    </p>
                </div>
            </div>
        </section>
    );
}
