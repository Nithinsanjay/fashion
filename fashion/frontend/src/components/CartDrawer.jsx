import React from 'react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) {
    if (!isOpen) return null

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">

                    <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ShoppingBag className="w-5 h-5 text-stone-900" />
                            <h2 className="text-lg font-bold text-stone-900">Your Shopping Bag ({cart.length})</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3">
                                <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                                <p className="text-sm">Your shopping bag is currently empty.</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-4 border-b border-stone-100 pb-4">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-20 h-24 object-cover rounded-lg bg-stone-100"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between font-medium text-stone-900 text-sm">
                                                <h4>{item.title}</h4>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-stone-500 mt-1">
                                                Size: <span className="font-semibold text-stone-800">{item.selectedSize}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-stone-200 rounded-lg">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                    className="p-1 hover:bg-stone-50 text-stone-600"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                    className="p-1 hover:bg-stone-50 text-stone-600"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => onRemove(item.id, item.selectedSize)}
                                                className="text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                            <div className="flex justify-between items-center text-base font-semibold text-stone-900">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-stone-500">Shipping and taxes calculated at checkout.</p>
                            <button
                                onClick={() => alert(`Order placed for $${subtotal.toFixed(2)}!`)}
                                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 rounded-xl transition-all shadow-sm"
                            >
                                Checkout Now
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}