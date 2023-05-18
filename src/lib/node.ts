export interface Node {
    id: string
    name: string
    isFile: boolean
    children: Node[]
}