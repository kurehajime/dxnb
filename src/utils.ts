import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT, END_OF_TIME
} from "./params";
import { Cell } from "./Components/cell";

export class Utils {

    // Suitの消去判定
    public static CheckSuit(row: Cell[]): boolean {
        let min = Math.min.apply(null, row.filter(x => x.Suit !== Suit.Wild).map(x => x.Suit)) as Suit
        let max = Math.max.apply(null, row.filter(x => x.Suit !== Suit.Wild).map(x => x.Suit)) as Suit
        return min === null || min === max
    }

    // Colorの消去判定
    public static CheckColor(row: Cell[]): boolean {
        let min = Math.min.apply(null, row.filter(x => x.Suit !== Suit.Wild).map(x => x.Color)) as Color
        let max = Math.max.apply(null, row.filter(x => x.Color !== Color.Rainbow).map(x => x.Color)) as Color
        return min === null || min === max
    }

    // 列をシャッフル
    public static ShuffleLine(line: Cell[]) {
        for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
            let color: Color = Math.floor(Math.random() * 3)
            let suit: Suit = Math.floor(Math.random() * 3)
            line[c].Color = color
            line[c].Suit = suit
            line[c].State = State.Live
            //Utils.ChangeWild(line[c])
        }
    }
    public static ChangeWild(cell: Cell) {
        let rand = Math.random()
        if (rand < 0.1) {
            cell.Suit = Suit.Wild
            cell.Color = Color.Rainbow
            cell.Draw()
        }
    }

    // 一番上の行を返す
    public static GetTopRowNumber(cells: Cell[][]) {
        let rtn = 0
        for (let r = 0; r < MAX_ROW_COUNT; r++) {
            if (cells[r][0].State !== State.Delete) {
                return rtn
            }
            rtn = r
        }
        return MAX_ROW_COUNT - 1
    }

    // 二次元のCell配列を1次元に
    public static GetCellArray(cells: Cell[][]): Cell[] {
        let cellArray: Cell[] = []
        for (let r = 0; r < MAX_ROW_COUNT; r++) {
            for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                cellArray.push(cells[r][c])
            }
        }
        return cellArray
    }

    // ボーナスブロックに変換
    public static ChangeBlock(cells: Cell[][], suit: Suit, color: Color) {
        let cellArray = Utils.GetCellArray(cells)
        if (suit !== null) {
            for (const cell of cellArray.filter(x => x.Suit === suit)) {
                cell.Suit = Suit.Wild
            }
        }
        if (color !== null) {
            for (const cell of cellArray.filter(x => x.Color === color)) {
                cell.Color = Color.Rainbow
            }
        }
    }
    public static Defrag(cells: Cell[][]): number {
        let point = 0
        for (let r1 = Utils.GetTopRowNumber(cells); r1 <= MAX_ROW_COUNT - 1; r1++) {
            if (cells[r1][0].State === State.Delete) {
                for (let r2 = r1; r2 > 0; r2--) {
                    for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                        cells[r2][c].Override(cells[r2 - 1][c])
                    }
                }

                for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                    cells[0][c].State = State.Delete
                }
                point++;
            }
        }
        return point
    }

    // 要素を揺らす
    public static Shake(con: createjs.Container) {
        createjs.Tween.get(con)
            .to({ x: FRAME_LEFT + 1, y: FRAME_TOP + 1, }, 50)
            .to({ x: FRAME_LEFT - 1, y: FRAME_TOP - 1, }, 50)
            .to({ x: FRAME_LEFT + 1, y: FRAME_TOP + 0, }, 50)
            .to({ x: FRAME_LEFT + 0, y: FRAME_TOP + 1, }, 50)
            .to({ x: FRAME_LEFT - 1, y: FRAME_TOP - 1, }, 50)
            .to({ x: FRAME_LEFT + 0, y: FRAME_TOP + 0, }, 50)
    }
}