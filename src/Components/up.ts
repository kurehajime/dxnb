import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT
} from "../params";
export class UpButton extends createjs.Container {
    public constructor() {
        super()
        this.Draw()
    }
    public Draw() {
        this.removeAllChildren()

        let color = "black"
        let x = 12 + (50 * (MAX_COLUMN_COUNT + 1)) / 2
        let y = (50 * (MAX_ROW_COUNT - 2)) / 2

        let cover = new createjs.Shape()
        cover.graphics.beginFill(color)
        cover.graphics.drawCircle(x, y, 100)
        cover.alpha = 0.1

        let word = new createjs.Text("↑", "300px serif", "White");
        word.textAlign = "center";
        word.x = x
        word.y = y - 115

        this.addChild(cover)
        this.addChild(word)

    }
}