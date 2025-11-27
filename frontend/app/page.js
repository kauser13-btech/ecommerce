export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="z-10 text-center px-4 max-w-3xl mx-auto">
                <div className="mb-8 inline-block">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm">
                        Something amazing is in the works
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">
                    Coming Soon
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    We are currently crafting a new experience. <br className="hidden md:block" />
                    Our site is under construction, but we will be back shortly with something special.
                </p>

                <div className="mt-12 flex justify-center gap-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
            </div>

            {/* Footer/Copyright */}
            <div className="absolute bottom-8 text-gray-500 text-sm z-10">
                &copy; {new Date().getFullYear()} Appleians. All rights reserved.
            </div>
        </div>
    );
}
