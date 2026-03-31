interface RoomData {
    name: string;
    area: string;
}

interface LayoutSectionProps {
    project: {
        name: string;
        image: string;
        floorPlan?: string;
        area: string;
        rooms?: RoomData[];
        description?: string;
    };
}

export default function LayoutSection({ project }: LayoutSectionProps) {
    const totalArea = project.area;
    const rooms = project.rooms || [];

    return (
        <section id="layout" className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-center mb-12 text-gray-900 tracking-tight">Продуманная планировка</h2>
                
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-green-50 rounded-[2.5rem] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 -z-10"></div>
                        <img 
                            src={project.floorPlan || project.image} 
                            alt={`Планировка проекта ${project.name}`} 
                            className="rounded-3xl shadow-xl border border-gray-100 object-contain w-full bg-white p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-bold font-serif text-gray-900 mb-4">Комфорт в деталях</h3>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                            {project.description || "Мы учли каждый квадратный метр, чтобы создать открытое и функциональное пространство для жизни."}
                        </p>
                        
                        {rooms.length > 0 ? (
                            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50/30">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100/50 border-b border-gray-200">
                                            <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-widest">Помещение</th>
                                            <th className="p-4 font-bold text-right text-gray-700 uppercase text-xs tracking-widest">Площадь</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rooms.map((room, i) => (
                                            <tr key={i} className="hover:bg-white transition-colors">
                                                <td className="p-4 text-gray-800 font-medium">{room.name}</td>
                                                <td className="p-4 text-right font-bold text-gray-900">{room.area}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-green-50/50">
                                            <td className="p-4 font-bold text-gray-900">Итого полезная:</td>
                                            <td className="p-4 text-right font-bold text-green-700 text-xl">{totalArea}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                <p className="text-gray-500 italic mb-4">Детальная экспликация помещений готовится по запросу для каждого конкретного участка.</p>
                                <span className="text-sm font-bold text-green-600 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full">Общая площадь: {totalArea}</span>
                            </div>
                        )}
                        
                        <div className="mt-10 bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-[2rem] text-white flex flex-col sm:flex-row shadow-xl shadow-green-900/10 items-center justify-between gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 text-center sm:text-left">
                                <div className="font-bold text-xl mb-1 flex items-center justify-center sm:justify-start gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Нужна подробная смета?
                                </div>
                                <div className="text-green-100 text-sm opacity-90">Скачайте PDF-презентацию с размерами стен и расстановкой мебели</div>
                            </div>
                            <button className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap relative z-10">
                                Скачать PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
