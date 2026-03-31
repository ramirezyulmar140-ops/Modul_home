export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <div className="font-bold font-serif text-2xl mb-2 text-gray-900">
                        Модуль<span className="text-green-600">Дом</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Производство модульных домов в Екатеринбурге.<br/>
                        © 2024-2026. Все права защищены.
                    </p>
                </div>
                
                <div className="text-center md:text-left text-gray-600 text-sm leading-relaxed">
                    <p>Свердловская область,<br/>пгт. Верхнее Дуброво, ул. Малиновая, 6</p>
                    <p className="mt-2 text-gray-400">ПН-ВС с 8:00 - 20:00 (по записи)</p>
                </div>

                <div className="text-center md:text-right">
                    <div className="flex flex-col space-y-3">
                        <a href="tel:+73432698533" className="text-xl font-bold font-serif text-gray-900 hover:text-green-600 transition-colors">
                            +7 (3432) 69-85-33
                        </a>
                        <a href="tel:+79226156197" className="text-xl font-bold font-serif text-gray-900 hover:text-green-600 transition-colors">
                            +7 (922) 615-61-97
                        </a>
                    </div>
                    <a href="#" className="text-sm text-accent hover:text-accent-hover transition-colors underline mt-4 inline-block">
                        Политика конфиденциальности
                    </a>
                </div>
            </div>
        </footer>
    );
}
