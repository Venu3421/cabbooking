import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"

export function NavBar({ items, className }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(items[0].name)

    useEffect(() => {
        // Update active tab based on current path
        const currentItem = items.find(item => item.url === location.pathname);
        if (currentItem) {
            setActiveTab(currentItem.name);
        }
    }, [location.pathname, items]);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    setIsVisible(false); // scrolling down
                } else {
                    setIsVisible(true);  // scrolling up
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
                y: isVisible ? 0 : -100,
                opacity: isVisible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className={cn(
                "fixed top-4 left-0 right-0 lg:left-[260px] lg:right-[360px] z-50 pointer-events-none flex justify-center",
                className,
            )}
        >
            <div className="flex items-center gap-2 bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-lg shadow-black/20 pointer-events-auto">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            to={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                "text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white",
                                isActive && "bg-white/10 text-white dark:bg-white/10 dark:text-white",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <div className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </motion.div>
    )
}
