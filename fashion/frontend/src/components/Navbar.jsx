import React from 'react'
import { ShoppingBag, Search, Sparkles, User, LogOut, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
    const { user, openAuth, logout } = useAuth()

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

                    {/* Brand Logo & Department Nav Group */}
                    <div className="flex items-center space-x-6">
                        {/* 69 STORE Brand Logo */}
                        <div
                            onClick={() => { onSelectCategory('All'); onSearchChange(''); }}
                            className="flex items-center space-x-3 cursor-pointer group py-1"
                        >
                            <img
                                src="/Neon Graffiti 69 Store Logo.png"
                                alt="69 STORE Logo"
                                className="h-12 w-auto rounded-lg object-contain group-hover:scale-105 transition-transform duration-300 shadow-sm border border-stone-200"
                            />
                            <div className="flex flex-col leading-none">
                                <span className="text-lg sm:text-xl font-black tracking-wider uppercase text-stone-900 group-hover:text-rose-500 transition-colors">
                                    69 STORE
                                </span>
                                <span className="text-[9px] font-bold tracking-[0.22em] text-stone-500 uppercase mt-0.5">
                                    THRIFT • WEAR • REPEAT
                                </span>
                            </div>
                        </div>

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

                    {/* Search, Account Profile & Shopping Bag */}
                    <div className="flex items-center space-x-3 sm:space-x-4">

                        {/* Search Input */}
                        <div className="relative hidden md:block w-44 lg:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeDepartment}...`}
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-stone-100 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                            />
                        </div>

                        {/* User Account Button / Avatar Menu */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-stone-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                </button>

                                {/* Profile Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 hidden group-hover:block z-50">
                                    <div className="px-4 py-2 border-b border-stone-100">
                                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                                        <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => alert(`Showing order history for ${user.email}`)}
                                        className="w-full flex items-center space-x-2 text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                                    >
                                        <Package className="w-3.5 h-3.5 text-stone-400" />
                                        <span>My Orders</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center space-x-2 text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                    >
                                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={openAuth}
                                className="flex items-center space-x-1.5 text-xs font-bold text-stone-800 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-full transition-all active:scale-95"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Sign In</span>
                            </button>
                        )}

                        {/* Shopping Bag Icon */}
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