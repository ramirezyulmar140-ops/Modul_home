
export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    BestTown
                </div>
                <div className="hidden md:flex gap-6 items-center">
                    <a href="#layout" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Планировка</a>
                    <a href="#feature-equipment" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Комплектация</a>
                    <a href="#excursion" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Экскурсия</a>
                </div>
                <div className="text-right flex flex-col items-end">
                    <a href="tel:+73432698533" className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">+7 (3432) 69-85-33</a>
                    <span className="text-xs text-gray-500">Екатеринбург и область</span>
                </div>
            </div>
        </header>
    );
}
