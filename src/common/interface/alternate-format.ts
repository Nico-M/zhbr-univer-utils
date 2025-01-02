export interface IluckySheetAlternateFormatSave {
    cellrange: {
        row: number[],
        column: number[]
    },
    format: IluckySheetAlternateFormatItem,
    hasRowHeader: boolean,
    hasRowFooter: boolean
}

export interface IluckySheetAlternateFormatItem {
    head: {
        fc: string,
        bc: string
    },
    one: {
        fc: string,
        bc: string
    },
    two: {
        fc: string,
        bc: string
    },
    foot: {
        fc: string,
        bc: string
    }
}