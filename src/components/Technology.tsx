import { useState } from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function Technology() {
    const [activeLayer, setActiveLayer] = useState<number | null>(3); // Default active layer (insulation)

    const layers = [
        {
            id: 1,
            name: "Внешняя отделка (Фасад)",
            thickness: "20-28 мм",
            description: "Имитация бруса, планкен или клик-фальц. Защищает дом от внешних воздействий и задает архитектурный стиль.",
            color: "bg-amber-800"
        },
        {
            id: 2,
            name: "Вентиляционный зазор",
            thickness: "40 мм",
            description: "Обрешетка из сухого бруска. Обеспечивает циркуляцию воздуха, предотвращая гниение дерева и скопление влаги.",
            color: "bg-gray-200"
        },
        {
            id: 3,
            name: "Ветро-влагозащитная мембрана",
            thickness: "Пленка",
            description: "Выпускает пар изнутри, но не пропускает ветер и капли воды снаружи. Защищает утеплитель от продувания.",
            color: "bg-blue-400"
        },
        {
            id: 4,
            name: "Силовой каркас + Утеплитель",
            thickness: "150-200 мм",
            description: "Сухая строганая доска (камерной сушки). Базальтовая минеральная вата повышенной плотности. Дом получается теплее кирпичного.",
            color: "bg-yellow-100" // Representation of insulation
        },
        {
            id: 5,
            name: "Пароизоляционная мембрана",
            thickness: "200 мкм",
            description: "Первичный барьер. Полностью блокирует попадание влажного теплого воздуха из помещения внутрь стены с проклейкой всех швов скотчем Delta.",
            color: "bg-transparent border border-blue-500"
        },
        {
            id: 6,
            name: "Внутренняя отделка",
            thickness: "12-20 мм",
            description: "Имитация бруса, вагонка штиль или гипсокартон под покраску. Экологически чистые материалы.",
            color: "bg-orange-100"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="technology">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                        <Layers className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6 leading-tight">
                        Технология: <span className="italic text-green-700">Что внутри стены?</span>
                    </h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Мы не экономим на скрытых материалах. Посмотрите, из чего состоит теплый контур нашего модульного дома.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

                    {/* Визуализация слоев (Левая колонка) */}
                    <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] flex items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="relative w-full h-full perspective-1000 flex flex-col justify-center transform -rotate-6 scale-90 md:scale-100 transition-transform duration-500 hover:rotate-0">
                            {layers.map((layer, index) => (
                                <div
                                    key={layer.id}
                                    className={`relative ${layer.color} w-full rounded-md shadow-sm transition-all duration-300 cursor-pointer overflow-hidden
                                        ${activeLayer === index ? 'z-10 scale-105 shadow-xl ring-2 ring-green-500 ring-offset-4' : 'opacity-80 hover:opacity-100 hover:scale-105'}
                                    `}
                                    style={{
                                        height: index === 3 ? '120px' : index === 1 ? '30px' : index === 2 || index === 4 ? '4px' : '40px',
                                        marginTop: index > 0 ? '4px' : '0',
                                        // Adding a subtle wood texture effect to wood layers
                                        backgroundImage: layer.id === 1 || layer.id === 6
                                            ? 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)'
                                            : layer.id === 4
                                                ? 'repeating-radial-gradient(circle, rgba(0,0,0,0.05) 2px, transparent 2px)' // insulation texture
                                                : 'none'
                                    }}
                                    onClick={() => setActiveLayer(index)}
                                    onMouseEnter={() => setActiveLayer(index)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10">
                                        <span className="text-xs font-bold bg-white/90 px-2 py-1 rounded shadow-sm text-gray-800">
                                            Слой {index + 1}
                                        </span>
                                    </div>
                                    {/* Number label for mobile or non-hover state */}
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 mix-blend-multiply opacity-50">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}

                            {/* Annotations/Labels pointing to the graphic */}
                            <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between py-10 text-xs font-bold text-gray-400 tracking-widest uppercase transform -rotate-90 origin-left hidden md:flex">
                                <span>Улица</span>
                                <span>Помещение</span>
                            </div>
                        </div>
                    </div>

                    {/* Описание слоев (Правая колонка) */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-4">
                            {layers.map((layer, index) => (
                                <div
                                    key={layer.id}
                                    className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${activeLayer === index
                                            ? 'bg-green-50 border-green-200 shadow-md transform translate-x-2'
                                            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                        }`}
                                    onClick={() => setActiveLayer(index)}
                                    onMouseEnter={() => setActiveLayer(index)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${activeLayer === index ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className={`text-lg font-bold font-serif ${activeLayer === index ? 'text-green-900' : 'text-gray-900'}`}>{layer.name}</h4>
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500 whitespace-nowrap">{layer.thickness}</span>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${activeLayer === index ? 'text-gray-700' : 'text-gray-500'}`}>
                                                {layer.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gray-900 rounded-2xl p-6 text-white flex items-center gap-4">
                            <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0" />
                            <p className="text-sm">
                                <strong className="font-bold">Двойной контроль качества.</strong> Каждый этап утепления и проклейки пленок фиксируется на фото и проходит жесткий внутренний аудит перед зашивкой стен.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
