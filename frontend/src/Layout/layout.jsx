"use client"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { applyTheme } from "../components/ui/theme"

const Layout = () => {
  useEffect(() => {
    // Apply theme when component mounts
    applyTheme()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
