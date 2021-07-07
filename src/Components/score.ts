import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT
} from "../params";
export class Score extends createjs.Container {
    public constructor() {
        super()
        this.UnDraw()
    }
    public Draw(point: number) {
        this.removeAllChildren()

        let color = "black"

        let cover = new createjs.Shape()
        cover.graphics.beginFill(color)
        cover.graphics.drawRect(0, 0, 300, 535)
        cover.alpha = 0.7

        let word = new createjs.Text("" + point, "48px serif", "White");
        word.textAlign = "center";
        word.x = (50 * (MAX_COLUMN_COUNT + 1)) / 2
        word.y = (50 * (MAX_ROW_COUNT - 1)) / 2

        this.addChild(cover)
        this.addChild(word)

    }

    public UnDraw() {
        this.removeAllChildren()
    }
}