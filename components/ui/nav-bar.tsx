import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <>
    <nav className='w-full border-0 py-4 lg:px-24 px-10 bg-gray-950'>
<h1 className='text-3xl text-white'>
    <Link href="/" >NextNav</Link>

</h1>
    </nav>
    </>
  )
}
