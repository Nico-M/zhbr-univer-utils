import {
  CellValueType,
  HorizontalAlign,
  ICellData,
  IStyleData,
  ITextRun,
  ITextStyle,
  IWorkbookData,
  IWorksheetData,
  Tools,
  VerticalAlign,
  WrapStrategy,
} from "@univerjs/core";
import { ILuckySheet } from "../common/interface/lucky-sheet";
import { ILuckyJson } from "../common/interface/lucky-json";
import { ILuckyInlineStrItem } from "../common/interface/cell-style";
import { IluckySheetCelldataValue } from "../common/interface/cell-data";
import { fontFamilyMap } from "../common/const/font-family";


export function cellData(
  workbookData: Partial<IWorkbookData>,
  worksheetData: Partial<IWorksheetData>,
  luckyJson: Partial<ILuckyJson>,
  sheet: Partial<ILuckySheet>
) {
  // cell data
  if (sheet.celldata) {
    if (!worksheetData.cellData) {
      worksheetData.cellData = {};
    }

    for (const cellItem of sheet.celldata) {
      const { r, c } = cellItem;
      if (!worksheetData.cellData[r]) {
        worksheetData.cellData[r] = {};
      }
      if (!worksheetData.cellData[r][c]) {
        worksheetData.cellData[r][c] = {};
      }

      const cell = cellItem.v;
      const newCell: ICellData = worksheetData.cellData[r][c];
      covertCell(newCell, cell);
    }
  }
}

export function covertCell(
  newCell: ICellData,
  cell: Partial<IluckySheetCelldataValue> | string | null
) {
  if (cell === null) return;

  if (typeof cell === "string") {
    newCell.v = cell;
    return;
  }

  // rich text
  if (cell?.ct?.t === "inlineStr") {
    const textRuns: ITextRun[] = [];
    let dataStream = "";
    const richTextList = cell.ct.s;

    if (!richTextList) {
      return;
    }

    let ed = 0;
    richTextList.forEach((inlineStrItem: Partial<ILuckyInlineStrItem>) => {
      const textStyle: ITextStyle = {};
      covertInlineStyle(textStyle, inlineStrItem);

      const content = replaceNewlines(String(inlineStrItem.v)) || "";
      dataStream += content;

      let st = ed;
      ed = st + content.length;

      textRuns.push({
        st,
        ed,
        ts: textStyle,
      });
    });

    dataStream += "\r\n";

    newCell.p = {
      id: Tools.generateRandomId(6),
      body: {
        dataStream,
        textRuns,
      },
      documentStyle: {},
    };
  }

  // content
  if (cell.v !== undefined) {
    let v = cell.v;
    if (typeof v === "boolean") {
      v = v ? 1 : 0;
      newCell.t = CellValueType.BOOLEAN;
    }
    newCell.v = cell.v;
  } else if (cell.m !== undefined) {
    newCell.v = cell.m;
  }

  if (cell.f !== undefined) {
    newCell.f = cell.f;
  }

  const cellStyle: IStyleData = {};

  covertInlineStyle(cellStyle, cell);
  covertCellStyle(cellStyle, cell);

  newCell.s = Object.assign(newCell.s || {}, cellStyle) as
    | IStyleData
    | ITextStyle;

  if (cell.ct?.fa && cell.ct?.fa !== "General") {
    newCell.s.n = {
      pattern: cell.ct?.fa ?? "",
    };
    newCell.t=typeMapping(cell.ct.t)
  }

  // 添加类型
  if(!isNaN(Number(cell.v))){
    newCell.t=CellValueType.NUMBER
  }
}

export function typeMapping(type: string|undefined) {
  switch (type) {
    case "s":
      return CellValueType.STRING;
    case "n":
      return CellValueType.NUMBER;
    case "d":
      return CellValueType.STRING;
    default:
      return CellValueType.STRING;
  }
}

export function covertInlineStyle(
  textStyle: ITextStyle,
  inlineStrItem: Partial<ILuckyInlineStrItem>
) {
  // font family
  if (inlineStrItem.ff !== undefined) {
    textStyle.ff = fontFamilyMap[inlineStrItem.ff];
  }

  // font color
  if (inlineStrItem.fc !== undefined) {
    textStyle.cl = {
      rgb: inlineStrItem.fc,
    };
  }

  // font size
  if (inlineStrItem.fs !== undefined) {
    textStyle.fs = Number(inlineStrItem.fs);
  }

  // bold
  if (inlineStrItem.bl !== undefined) {
    textStyle.bl = inlineStrItem.bl;
  }

  // italic
  if (inlineStrItem.it !== undefined) {
    textStyle.it = inlineStrItem.it;
  }

  // strikethrough
  if (inlineStrItem.cl !== undefined) {
    textStyle.st = {
      s: inlineStrItem.cl,
    };
  }

  // underline
  if (inlineStrItem.un !== undefined) {
    textStyle.ul = {
      s: inlineStrItem.un,
    };
  }
}

export function covertCellStyle(
  cellStyle: IStyleData,
  cell: Partial<IluckySheetCelldataValue>
) {
  // background color
  if (cell.bg !== undefined) {
    cellStyle.bg = {
      rgb: cell.bg,
    };
  }

  // vertical align
  if (cell.vt !== undefined) {
    switch (String(cell.vt)) {
      case "0":
        cellStyle.vt = VerticalAlign.MIDDLE;
        break;
      case "1":
        cellStyle.vt = VerticalAlign.TOP;
        break;
      case "2":
        cellStyle.vt = VerticalAlign.BOTTOM;
        break;

      default:
        break;
    }
  }

  // horizontal align
  if (cell.ht !== undefined) {
    switch (String(cell.ht)) {
      case "0":
        cellStyle.ht = HorizontalAlign.CENTER;
        break;
      case "1":
        cellStyle.ht = HorizontalAlign.LEFT;
        break;
      case "2":
        cellStyle.ht = HorizontalAlign.RIGHT;
        break;

      default:
        break;
    }
  }

  // vertical text
  if (cell.tr !== undefined) {
    switch (cell.tr) {
      case "0":
        cellStyle.tr = {
          a: 0,
          v: 0,
        };
        break;

      case "1":
        cellStyle.tr = {
          a: -45,
          v: 0,
        };
        break;

      case "2":
        cellStyle.tr = {
          a: 45,
          v: 0,
        };
        break;

      case "3":
        cellStyle.tr = {
          a: 0,
          v: 1,
        };
        break;

      case "4":
        cellStyle.tr = {
          a: -90,
          v: 0,
        };
        break;

      case "5":
        cellStyle.tr = {
          a: 90,
          v: 0,
        };
        break;

      default:
        break;
    }
  }

  // text wrap
  if (cell.tb !== undefined) {
    switch (String(cell.tb)) {
      case "0":
        cellStyle.tb = WrapStrategy.CLIP;
        break;
      case "1":
        cellStyle.tb = WrapStrategy.OVERFLOW;
        break;
      case "2":
        cellStyle.tb = WrapStrategy.WRAP;
        break;

      default:
        break;
    }
  }
}

function replaceNewlines(input: string): string {
  return input.replace(/\n/g, "\r");
}