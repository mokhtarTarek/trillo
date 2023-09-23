'use client'

import { useBoardStore } from '@/store/BoardStore'
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import Column from './Column'


const Board = () => {
    const [board, getBord, setBoardState, updateTodoInDB] = useBoardStore(state =>
        [state.board,
        state.getBoard,
        state.setBoardState,
        state.updateTodoInDB

        ])

    useEffect(() => {
        getBord()
    }, [getBord])

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source, type } = result
        // destination = {droppableId:column index,index:cardindex}
        // source = {droppableId:column index,index:cardindex}
        // type : column || card
        console.log(destination)
        console.log(source)
        console.log(type)
        // check if user drag card outide of board
        if (!destination) return

        //Handle column darg
        if (type === 'column') {
            // create array from map                             //     0                            1      2
            const entries = Array.from(board.columns.entries()) // [[todo,{id:'todo',todos:[...]}],[....],[...] ]
            // splice methode mutate original array and return a new array of cutted items
            const [removed] = entries.splice(source.index, 1)
            entries.splice(destination.index, 0, removed)
            const rearrangedColumns = new Map(entries)
            // update board store
            setBoardState({
                ...board,
                columns: rearrangedColumns
            })
        }
        /// IF TYPE IS CARD
        if (type === "card") {


            const columns = Array.from(board.columns)
            const startColIndex = columns[Number(source.droppableId)] // [todo,{id:todo , todos:[...,...,...]}]
            const finishColIndex = columns[Number(destination.droppableId)] // [done,{id:done , done:[...,...,...]}]

            // source:
            const startCol: Column = {
                id: startColIndex[0],
                todos: startColIndex[1].todos
            } // {id:todo , todos:{id,todos}}

            // destination:
            const finishCol: Column = {
                id: finishColIndex[0],
                todos: finishColIndex[1].todos
            } // {id:todo , todos:{id,todos}}


            if (!startCol || !finishCol) return
            if (source.index === destination.index && startCol === finishCol) return

            // update the start col todos after changes
            const newTodos = startCol.todos
            const [todoMoved] = newTodos.splice(source.index, 1) // remove the selected todo from source column
            // don't forget that the returned value of the splice method is an array of removed items
            // so we must destructure the value 

            if (startCol.id === finishCol.id) {
                //Same column task drag
                newTodos.splice(destination.index, 0, todoMoved) // insert the todoMoved in the new position
                // create a new columns to update the columns prop of the board
                const newCol = {
                    id: startCol.id,
                    todos: newTodos,
                };
                // NOTE : PURE FUNCTION PRINCIPLES
                const newColumns = new Map(board.columns)//create a new map from the original board.columns
                newColumns.set(startCol.id, newCol) // update the columns
                // update the store
                setBoardState({ ...board, columns: newColumns })

            } else {
                // dragging to onother column
                const finishTodos = Array.from(finishCol.todos)//get the todos list from the destination col
                finishTodos.splice(destination.index, 0, todoMoved) // append the todos list with the selected todo

                const newColumns = new Map(board.columns); // create a new cols from existing board.columns
                // create a new col from start column
                const newCol = {
                    id: startCol.id,
                    todos: newTodos,
                };
                newColumns.set(startCol.id, newCol)//update start column
                newColumns.set(finishCol.id, { // update finish column
                    id: finishCol.id,
                    todos: finishTodos
                })

                // UPDATE IN DB
                updateTodoInDB(todoMoved, finishCol.id)
                setBoardState({ ...board, columns: newColumns })
            }
        }
    }
    return (

        <DragDropContext onDragEnd={handleOnDragEnd} >
            <Droppable droppableId='board' direction='horizontal' type='column' >
                {(provided) =>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto   "
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {
                            /* rendering all columns */

                            Array.from(board.columns.entries()).map(([id, column], index) => (
                                <Column
                                    key={id}
                                    id={id}
                                    todos={column.todos}
                                    index={index}

                                />
                            ))
                        }
                    </div>

                }

            </Droppable>

        </DragDropContext>
    )
}

export default Board