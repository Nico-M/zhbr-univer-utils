
//luckysheet general selection
export interface IluckySheetSelection {
    row: number[], //selection start row and end row
    column: number[], //selection start column and end column
    sheetIndex?: number
    row_focus?: number, //selection focus row
    column_focus?: number, //selection focus column
    left?: number, //selection left
    width?: number, //selection width
    top?: number, //selection top
    height?: number, //selection height
    left_move?: number, //selection move left
    width_move?: number, //selection move width
    top_move?: number, //selection move top
    height_move?: number, //selection move height
}