import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Quiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const questions = [
        {
            title: "У вас уже есть участок под строительство?",
            options: ["Да, в Екатеринбурге / пригороде", "Да, в области (дальше 50 км)", "Пока только планирую покупку"]
        },
        {
            title: "Какая планируемая площадь дома?",
            options: ["До 45 кв.м (Студия / 1 спальня)", "50-70 кв.м (Семья с 1 ребенком)", "От 80 кв.м (Большая семья)", "Еще не определился"]
        },
        {
            title: "В какой бюджет (с отделкой) планируете уложиться?",
            options: ["До 2,5 млн рублей", "До 4 млн рублей", "До 6 млн рублей", "Бюджет пока не считал"]
        },
        {
            title: "Когда планируете праздновать новоселье?",
            options: ["В ближайшие 1-2 месяца", "В этом сезоне (летом/осенью)", "В следующем году"]
        }
    ];

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsCompleted(true);
        }
    };

    return (
        <section className="py-20 lg:pt-10 pb-24 bg-gradient-to-b from-gray-50/50 to-emerald-50 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full opacity-60 blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <div className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
                        Расчет за 1 минуту
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6 leading-tight">
                        Узнайте точную стоимость <span className="italic text-green-700">вашего будущего дома</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 font-sans">
                        Ответьте на 4 простых вопроса и мы пришлем вам подробную смету, а также <strong className="text-gray-900">каталог из 25+ проектов и купон на скидку 50 000 ₽</strong>.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">

                    {/* Progress bar Container */}
                    <div className="bg-gray-100 h-2.5 w-full relative overflow-hidden">
                        {!isCompleted && (
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 ease-out rounded-r-full shadow-[0_0_10px_rgba(22,163,74,0.5)]"
                                style={{ width: `${((currentStep) / questions.length) * 100}%` }}
                            ></div>
                        )}
                        {isCompleted && (
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-green-500 to-green-600 opacity-100 transition-opacity duration-1000"></div>
                        )}
                    </div>

                    <div className="p-8 md:p-12">
                        {!isCompleted ? (
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                                        Вопрос {currentStep + 1} из {questions.length}
                                    </span>
                                    <span className="text-sm text-gray-400 font-medium">Осталось {questions.length - currentStep}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-8 leading-tight">
                                    {questions[currentStep].title}
                                </h3>

                                <div className="space-y-4">
                                    {questions[currentStep].options.map((option, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center p-5 md:p-6 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50/50 hover:shadow-md transition-all duration-300 group transform hover:-translate-y-0.5"
                                            onClick={() => setTimeout(handleNext, 400)}
                                        >
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-green-600 mr-5 flex-shrink-0 relative bg-white shadow-inner">
                                                <div className="absolute inset-0 m-1 rounded-full bg-green-600 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                                            </div>
                                            <span className="text-gray-800 font-semibold text-lg group-hover:text-green-900 transition-colors">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 animate-[fadeIn_0.8s_ease-out]">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner border border-green-200">
                                    <CheckCircle2 className="w-12 h-12 text-green-600 animate-[pulse_2s_infinite]" />
                                </div>
                                <h3 className="text-3xl font-bold font-serif text-gray-900 mb-4">
                                    Ваш бонус и смета готовы!
                                </h3>
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-8 max-w-md mx-auto text-left flex items-start gap-4">
                                    <div className="text-yellow-600 font-bold text-3xl shrink-0 mt-1">🎁</div>
                                    <div>
                                        <p className="font-bold text-yellow-900 mb-1">Подарок за прохождение:</p>
                                        <p className="text-sm text-yellow-800 leading-tight">
                                            Каталог скрытых планировок и купон-скидка на 50 000 ₽ на любую террасу. Зарезервировано за вашим номером.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 font-medium mb-8 max-w-md mx-auto text-lg px-4">
                                    Куда прислать каталог проектов со сметой и ваш купон?
                                </p>

                                <form className="max-w-sm mx-auto space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Ваш WhatsApp (+7...)"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-600/10 focus:border-green-500 outline-none text-center font-bold text-gray-900 placeholder-gray-400 transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-xl shadow-green-700/20 transform hover:-translate-y-1 group border-b-4 border-green-800 hover:border-green-600 active:border-b-0 active:translate-y-0"
                                    >
                                        <span>Забрать смету и подарки</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-xs text-gray-400 text-center leading-relaxed mt-4">Мы не отправляем спам. Ваши данные в безопасности.</p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
