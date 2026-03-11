import { FileText, Send } from 'lucide-react';

export default function LeadForm1() {
    return (
        <section className="py-20 bg-green-800 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Left: Info */}
                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-green-600 mb-8 border border-green-100">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4 leading-tight">
                                Скачайте каталог: Топ-10 проектов с актуальными ценами
                            </h2>
                            <p className="text-gray-600 mb-0 text-lg leading-relaxed">
                                Оставьте номер — и робот <strong className="text-gray-900 font-semibold">моментально</strong> пришлет вам PDF-презентацию в WhatsApp с подробными планировками и сметами на этот год.
                            </p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">Ваш WhatsApp (телефон)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="+7 (999) 000-00-00"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-600/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900 placeholder-gray-400 shadow-inner"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all shadow-xl shadow-green-700/20 transform hover:-translate-y-1 group"
                            >
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Получить PDF-каталог сейчас
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Нажимая на кнопку, вы соглашаетесь с Политикой конфиденциальности. Ваши данные надежно защищены.
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
