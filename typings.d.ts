/*
map is a specific object (a collection of key values pairs)
a key can accure only once
a key can be anything {even an object itself}

-------------------------- BORAD STORE -----------------------------
Board is a big Object (called BoardStore) that contain three
big columns of type TypedColumn (todo,in progress and done) => keys
the value of these 3 unique keys are object of type interface Column 
{id:TypedColum,todos:Todo[]}
every colum have a key property called id with three possible values of type TypedColumn 
and a key property called todos relative to a list of todo []
--------------------------------------------------------------------
*/
interface Board {
    // this a generic Map : means the key values are generic 
    // (non static type ewp : Map<string,string>)

    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"


interface Column {
    id: TypedColumn;
    todos: Todo[]
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
}

interface Image {
    bucketId: string;
    fileId: string;
}