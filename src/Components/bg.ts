import {
    MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT
} from "../params";
export class Bg extends createjs.Container {
    public constructor() {
        super()
        this.Draw()
    }
    public Draw() {
        this.removeAllChildren()

        let color = "black"
        let cover = new createjs.Shape()
        cover.graphics.beginFill(color)
        cover.graphics.drawRect(0, 0, 300, 510)
        cover.alpha = 0.8
        this.addChild(cover)
    }

}