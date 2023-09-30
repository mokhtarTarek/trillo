const formatTodoForAi = (board: Board) => {
    const todos = Array.from(board.columns.entries())

    // --> [["done", {id:"done",todos:[]}],...]
    // [key,value] destructuring the current value
    // done->key && {id:"done",todos:[]} -> value.todos => Todo[]
    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos
        return map // {key:Todo[]}

    }, {} as { [key in TypedColumn]: Todo[] })// initial value
    //reduce to key:value (length)
    const flatArrayCounted = Object.entries(flatArray)
        .reduce((map, [key, value]) => {
            map[key as TypedColumn] = value.length
            return map;
        }, {} as { [key in TypedColumn]: number });
    return flatArrayCounted // {done:10,inprogress:15,...}
}
export default formatTodoForAi