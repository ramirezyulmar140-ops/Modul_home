export default function ExcursionSection() {
    return (
        <section id="excursion" className="py-20 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">Лучше один раз увидеть вживую!</h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                    Запишитесь на бесплатную экскурсию по готовым и строящимся объектам. Оцените качество материалов, походите по комнатам и задайте любые вопросы инженеру.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="tel" 
                        placeholder="Ваш номер телефона" 
                        className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent text-lg" 
                        required 
                    />
                    <button 
                        type="submit" 
                        className="bg-accent hover:bg-accent-hover text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors duration-200 whitespace-nowrap shadow-lg shadow-accent/30"
                    >
                        Записаться
                    </button>
                </form>
                <p className="text-sm text-gray-400 mt-6">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
            </div>
        </section>
    );
}
