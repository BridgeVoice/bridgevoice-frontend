function Home() {
    return (
        <main className="min-h-screen bg-[#EAF4EC] flex flex-col items-center justify-center -mt-32">

            <header className="flex justify-center px-10 py-6">
                <h1 className="text-8xl font-bold text-blue-600">
                    BridgeVoice
                </h1> 
            </header>

            <div className="flex flex-col items-center space-y-8">

                <p className="mt-4 text-3xl text-gray-600 ">
                    Welcome to BridgeVoice!
                </p>

                <p className="mt-6 max-w-2xl text-center text-2xl leading-relaxed text-gray-500">
                    Utilize our AI-powered English conversation learning platform designed to help users build confidence through real-life speaking practice — completely free.
                </p>

                <button className="mt-12 rounded-full bg-blue-600 px-10 py-4 text-xl font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl">
                    Get Started
                </button>
            
            </div>

        </main>
        
    )
} 

export default Home