import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;
    setSearchString: (searchString: string) => void
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void,
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void
    setNewTaskInput: (input: string) => void
    setNewTaskType: (columnId: TypedColumn) => void
    setImage: (image: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
    // INITIALIZE THE BOARD STATE
    board: {
        columns: new Map<TypedColumn, Column>() //
    },
    searchString: "",
    newTaskInput: "",
    newTaskType: "done",
    image: null,
    // FETCH DATA AND GROUPE THEM BY CATEGORIES (COLUMNS)
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board })
    },

    setBoardState: (board) => set({ board }),
    setSearchString: (searchString) => set({ searchString }),
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
    setImage: (image: File | null) => set({ image }),
    deleteTask: async (taskIndex, todo, id) => {
        // create a new columns map from the existing bord 
        const newCols = new Map(get().board.columns)
        // delete the specifique todo 
        newCols.get(id)?.todos.splice(taskIndex, 1)
        // update bord
        set({ board: { columns: newCols } })
        // delete image from db if it exist
        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }
        //delete doc from db
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )

    },
    // UPDATE A DOC IN APPWRITE
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },
    addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
        (' add task function')
        // upload image
        let file: Image | undefined
        if (image) {
            const fileUploaded = await uploadImage(image);
            (fileUploaded)
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }
        // add document to db 
        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                // include image if it exists
                ...(file && { image: JSON.stringify(file) })
            }
        )

        set({ newTaskInput: '' })
        set(state => {
            // make a copy of existing cols
            const newCols = new Map(state.board.columns);
            //create a new todo document
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file }),

            }
            // select the properly column using the columnId arg
            const col = newCols.get(columnId)
            // if the column not exist then add it
            if (!col) {
                newCols.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                })
            } else {
                // otherwise get the specific col and append the todos list
                newCols.get(columnId)?.todos.push(newTodo)
            }
            return {
                board: {
                    columns: newCols
                }
            }
        })

    }

}))