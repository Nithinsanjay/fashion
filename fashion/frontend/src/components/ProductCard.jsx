import React, { useState } from 'react'

export default function ProductCard({ product, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M')

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {product.badge && (
                    <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                        {product.badge}
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                            {product.title}
                        </h3>
                        <span className="font-bold text-stone-900 text-sm sm:text-base">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    <span className="text-xs text-stone-400 block mb-3">
                        {product.category}
                    </span>

                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            Size
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${selectedSize === size
                                            ? 'border-stone-900 bg-stone-900 text-white font-medium'
                                            : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-stone-50'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onAddToCart(product, selectedSize)}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]"
                >
                    Add to Bag
                </button>
            </div>
        </div>
    )
}