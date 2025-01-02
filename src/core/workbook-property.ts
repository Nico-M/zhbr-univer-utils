import { IWorkbookData, LocaleType } from "@univerjs/core";
import { ILuckyJson } from "../common/interface/lucky-json";
import { localeMap } from "../common/const/locale";

export function workbookProperty(workbookData: Partial<IWorkbookData>, luckyJson: Partial<ILuckyJson>){
    
    if (luckyJson.lang !== undefined) {
        workbookData.locale = localeMap[luckyJson.lang as string] || LocaleType.EN_US;
    }
}