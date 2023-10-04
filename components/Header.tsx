'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useAmp } from 'next/amp'
import { useBoardStore } from '@/store/BoardStore'
import fetchSuggestion from '@/lib/fetchSuggestion'

const Header = () => {
    const [board, searchString, setSearchString] = useBoardStore(state => [
        state.board,
        state.searchString,
        state.setSearchString
    ])

    // const [loading, setLoading] = useState<boolean>(false)
    // const [suggestion, setSuggestion] = useState<string>("")
    // fetch openai

    // useEffect(() => {
    //     if (board.columns.size === 0) return
    //     setLoading(true);
    //     const fetchSuggestionFunc = async () => {
    //         const suggestion = await fetchSuggestion(board)
    //         setSuggestion(suggestion)
    //         setLoading(false)
    //     }
    //     fetchSuggestionFunc();

    // }, [board])


    return (
        <header>
            <div className='flex flex-col  justify-center md:flex-row item-center p-5 bg-gray-500/10 rounded-b-2xl' >
                <div className="
                absolute
                top-0
                left-0
                w-full
                h-96
                bg-gradient-to-br
                from-pink-400
                to-[#0055D1]
                rounded-md
                filter
                blur-3xl
                opacity-50
                -z-50
                
                "/>
                <div className='flex justify-center  ' >
                    <Image
                        src="https://links.papareact.com/c2cdd5"
                        alt='Trillo Icon'
                        width={300}
                        height={100}
                        className='w-40 pd-10 my-5 md:my-0 md:pd-0 object-contain'
                    />
                </div>
                <div className='flex item-center justify-center space-x-5 flex-1 md:justify-end w-full  ' >
                    {/* search box */}
                    <form action="" className='flex  items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial '>
                        <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search'
                            className='flex-1 outline-none'
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <button hidden >Search</button>
                    </form>
                    {/* Avatar */}
                    <Avatar name='Tare Mokhtar' size='44' round color='#0055D1' />
                </div>


            </div>
            <div className='flex justify-center items-center px-5 md:py-5 ' >
                <p className='flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]
                ' >
                    <UserCircleIcon className={`h-8 w-8  text-[#0055D1] mr-1  `} />
                    {/* {
                        suggestion && !loading
                            ? suggestion
                            : "GPT is summarizing your tasks for the day ..."
                    } */}
                    GPT is summarizing your tasks for the day ...
                </p>

            </div>
        </header>
    )
}

export default Header