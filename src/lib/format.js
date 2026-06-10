import { C } from "./constants";

export const pColor = p => p==="CRITIQUE"?C.red:p==="ÉLEVÉ"?C.amber:C.teal;

export const pBg    = p => p==="CRITIQUE"?C.redL:p==="ÉLEVÉ"?C.amberL:C.tealL;

export const mColor = t => t==="inconsistency"?C.red:t==="context"?C.accent:C.amber;

export const mBg    = t => t==="inconsistency"?C.redL:t==="context"?C.accentL:C.amberL;

export const mIcon  = t => t==="inconsistency"?"⚡":t==="context"?"🔗":"🔁";
