'use client'

import React from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'

const Header = () => {
    return (
        <header>
            <div className='flex flex-col md:flex-row item-center p-5 bg-gray-500/10 rounded-b-2xl' >
                <Image
                    src="https://links.papareact.com/c2cdd5"
                    alt='Trillo Icon'
                    width={300}
                    height={100}
                    className='w-40 pd-10 md:pd:0 object-contain'
                />
                <div className='flex item-center space-x-5 flex-1 md:justify-end w-full  ' >
                    {/* search box */}
                    <form action="" className='flex ' >
                        <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                        <input type='text' placeholder='Search' className='flex-1 outline-none ' />
                        <button hidden >Search</button>
                    </form>
                    {/* Avatar */}
                    <Avatar name='Tare Mokhtar' size='44' round />
                </div>

            </div>
        </header>
    )
}

export default Header