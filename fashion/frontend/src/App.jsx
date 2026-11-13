import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import ProductCard from './components/ProductCard'
import AuthModal from './context/AuthModel'
import CartDrawer from './components/CartDrawer'
import { DEPARTMENT_CONFIGS, PRODUCTS_CATALOG } from './data/mockData'

export default function App() {
    const [activeDepartment, setActiveDepartment] = useState('women') // 'women' | 'men' | 'unisex'
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [cart, setCart] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [products, setProducts] = useState(PRODUCTS_CATALOG)

    const activeConfig = DEPARTMENT_CONFIGS[activeDepartment]

    // Fetch live products from PostgreSQL backend
    useEffect(() => {
        fetch('http://localhost:8000/api/products')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && data.length > 0) {
                    setProducts(data)
                }
            })
            .catch(() => {
                // Fallback gracefully to catalog
            })
    }, [])

    // Switch department handler
    const handleDepartmentChange = (deptKey) => {
        setActiveDepartment(deptKey)
        setSelectedCategory('All')
        setSearchQuery('')
    }

    // Add item to cart
    const handleAddToCart = (product, selectedSize) => {
        setCart((prev) => {
            const exists = prev.find(
                (item) => item.id === product.id && item.selectedSize === selectedSize
            )
            if (exists) {
                return prev.map((item) =>
                    item.id === product.id && item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ...product, selectedSize, quantity: 1 }]
        })
        setIsCartOpen(true)
    }

    // Update quantity
    const handleUpdateQuantity = (productId, selectedSize, newQty) => {
        if (newQty <= 0) {
            handleRemove(productId, selectedSize)
            return
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId && item.selectedSize === selectedSize
                    ? { ...item, quantity: newQty }
                    : item
            )
        )
    }

    // Remove from cart
    const handleRemove = (productId, selectedSize) => {
        setCart((prev) =>
            prev.filter(
                (item) => !(item.id === productId && item.selectedSize === selectedSize)
            )
        )
    }

    // Filter products by department, category, and search
    const visibleProducts = products.filter((product) => {
        const matchDept = product.department === activeDepartment
        const matchCat = selectedCategory === 'All' || product.category === selectedCategory
        const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchDept && matchCat && matchSearch
    })

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
            {/* Navigation */}
            <Navbar
                activeDepartment={activeDepartment}
                onSelectDepartment={handleDepartmentChange}
                categories={activeConfig.categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                cartCount={totalCartCount}
                onOpenCart={() => setIsCartOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1">
                {/* Dynamic Hero Banner */}
                <HeroBanner config={activeConfig} />

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 mt-12 border-b border-stone-200 pb-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block mb-1">
                            {activeConfig.name} / {selectedCategory}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                            Curated Selection ({visibleProducts.length})
                        </h2>
                    </div>

                    {/* Quick Category Pills on Mobile */}
                    <div className="flex space-x-2 overflow-x-auto py-2 sm:hidden">
                        {activeConfig.categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 text-xs rounded-full font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-stone-900 text-white shadow-sm'
                                        : 'bg-white text-stone-600 border border-stone-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {visibleProducts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-200">
                        <p className="text-stone-400 text-sm font-semibold uppercase tracking-wider">
                            No pieces found in this category.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('All')
                                setSearchQuery('')
                            }}
                            className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full text-xs font-bold hover:bg-stone-800 transition-all shadow-sm"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Auth Modal & Cart Drawer */}
            <AuthModal />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
            />
        </div>
    )
}
