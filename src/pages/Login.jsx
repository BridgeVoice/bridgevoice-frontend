function Login() {
    return (
        <main className="min-h-screen bg-[#EAF4EC] flex items-center justify-center px-6">
            <section className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"> 
                <h1 className="text-center text-4xl font-bold text-blue-600"> 
                    Login
                </h1>

                <p className="mt-3 text-center text-gray-500"> 
                    Welcome back to BridgeVoice!
                </p> 

                <form className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                </form>

                <button className="mt-4 w-full rounded-full bg-blue-600 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-xl">
                    Login
                </button>

                <p className="mt-4 text-center text-sm text-gray-500 cursor-pointer hover:underline">
                    Forgot Password?
                </p>
                
                <p className="mt-3 text-center text-sm text-gray-600"> 
                    First time user?{" "}
                    <span className="font-semibold text-blue-600">
                        Sign Up
                    </span>
                </p>

            </section>
        </main>
    );
} 

export default Login