import React from 'react'
import { ShoppingBag, Search, Sparkles } from 'lucide-react'

export default function Navbar({
    activeDepartment,
    onSelectDepartment,
    cartCount,
    onOpenCart,
    selectedCategory,
    onSelectCategory,
    categories,
    searchQuery,
    onSearchChange,
}) {
    const departments = [
        { key: 'women', label: 'WOMEN' },
        { key: 'men', label: 'MEN' },
        { key: 'unisex', label: 'UNISEX' },
    ]

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">

            {/* 1. Top Department Toggle Bar */}
            <div className="bg-stone-900 text-stone-200 text-xs tracking-wider uppercase">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-10">
                    <div className="flex space-x-1 sm:space-x-3">
                        {departments.map((dept) => (
                            <button
                                key={dept.key}
                                onClick={() => onSelectDepartment(dept.key)}
                                className={`px-3 py-1 font-semibold rounded-t-sm transition-all ${activeDepartment === dept.key
                                        ? 'bg-white text-stone-900 font-bold shadow-sm'
                                        : 'text-stone-400 hover:text-white'
                                    }`}
                            >
                                {dept.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center space-x-1 text-stone-400 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Complimentary express shipping on orders over $150</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Brand Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Brand Logo */}
                    <div className="flex items-center space-x-6">
                        <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase cursor-pointer">
                            ATELIER<span className="text-rose-500">.</span>
                        </span>

                        {/* Department Categories */}
                        <nav className="hidden lg:flex space-x-6 text-sm">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => onSelectCategory(cat)}
                                    className={`transition-colors py-1 ${selectedCategory === cat
                                            ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                                            : 'text-stone-500 hover:text-stone-900 font-medium'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Search & Shopping Bag */}
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden sm:block w-48 lg:w-60">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeDepartment}...`}
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-stone-100 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                            />
                        </div>

                        <button
                            onClick={onOpenCart}
                            className="relative p-2.5 rounded-full hover:bg-stone-100 transition-colors"
                            aria-label="Open Cart"
                        >
                            <ShoppingBag className="w-6 h-6 text-stone-800" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </header>
    )
}