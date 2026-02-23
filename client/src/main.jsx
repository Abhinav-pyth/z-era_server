import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ConfigProvider } from './context/ConfigContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <ThemeProvider>
                    <ConfigProvider>
                        <AuthProvider>
                            <CartProvider>
                                <App />
                                <Toaster
                                    position="top-right"
                                    toastOptions={{
                                        style: {
                                            background: 'var(--bg-card)',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border-subtle)',
                                            fontFamily: 'Outfit, sans-serif'
                                        }
                                    }}
                                />
                            </CartProvider>
                        </AuthProvider>
                    </ConfigProvider>
                </ThemeProvider>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>
)
