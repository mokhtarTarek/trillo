import Board from "@/components/Board"
import { todo } from "node:test"
import formatTodoForAi from "./formatTodoForAi";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodoForAi(board)
    console.log("formatted TODO to send : ", todos)

    const res = await fetch('/api/generateSummary', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/JSON'
        },
        body: JSON.stringify({ todos })

    });
    const GPTdata = await res.json()
    console.log(GPTdata)
    const { content } = GPTdata
    return content;

}
export default fetchSuggestion