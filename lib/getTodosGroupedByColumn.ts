import { databases } from "@/appwrite"

export const getTodosGroupedByColumn = async () => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!);
    const todos = data.documents

    // Groupe todos list by three categorie 
    // (columns:TypedColumn:'todo,inprogress,done')
    const columns = todos.reduce((acc, todo) => {
        // check if column exist beofre pushing the todo
        // if not add the column key to the Map object
        if (!acc.get((todo.status))) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }
        // now push the todo document to the specific column
        acc.get(todo.status)?.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            // destructuring property image only if it exist
            ...(todo.image && { image: todo.image })
        }
        )
        return acc
    }
        , new Map<TypedColumn, Column>)

    // ensure that all three columns exist in the board
    // maybe the data coming from the api does not contain
    // one of the categories

    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"]

    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })

        }
    }

    // const mapp = new Map([[1,2],[3,4]]) -->Map constractor(iterable<key,value>)
    const sortedColumns = new Map(
        // Array.from(map.entries()) ==> [Array(key,value), Array(key,values)]
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )
    const board: Board = {
        columns: sortedColumns
    }
    return board
}

