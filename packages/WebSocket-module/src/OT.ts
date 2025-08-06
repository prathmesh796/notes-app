enum OTTypes {
    INSERT = 'insert',
    UPDATE = 'update',
    DELETE = 'delete',
    INIT= 'init'
}
interface OT {
    type: OTTypes
    value: string
    pos: number
    timestamp: number
}

export { OT, OTTypes };