import React from 'react'

export default function HeroBanner({ config }) {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-white my-6 shadow-xl">
            <div className="absolute inset-0 z-0">
                <img
                    src={config.heroImage}
                    alt={config.tagline}
                    className="w-full h-full object-cover object-center opacity-40 filter saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-xl px-8 py-16 sm:py-24 sm:px-12">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-4">
                    {config.badge}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                    {config.headline}
                </h1>
                <p className="text-stone-300 text-sm sm:text-base mb-8">
                    {config.subtext}
                </p>
                <div className="flex space-x-4">
                    <button className="bg-white hover:bg-stone-100 text-stone-900 text-sm font-bold px-6 py-3 rounded-full transition-all active:scale-95">
                        Explore {config.name}
                    </button>
                    <button className="border border-white/40 hover:bg-white/10 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all">
                        View Lookbook
                    </button>
                </div>
            </div>
        </section>
    )
}