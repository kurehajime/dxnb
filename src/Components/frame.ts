import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT
} from "../params";
export class Frame extends createjs.Container {
    public constructor() {
        super()
        this.Draw()
    }
    public Draw() {
        this.removeAllChildren()

        let color = "black"



        let top = new createjs.Shape()
        top.graphics.beginFill(color)
        top.graphics.drawRect(0, 0, 50 * (MAX_COLUMN_COUNT + 1), FRAME_TOP)
        this.addChild(top)

        let toge = new createjs.Shape()
        toge.graphics.beginFill("red")
        toge.graphics.drawRect(0, FRAME_TOP, 50 * (MAX_COLUMN_COUNT + 1), 10)
        toge.alpha = 0.5
        this.addChild(toge)

        let bottom = new createjs.Shape()
        bottom.graphics.beginFill(color)
        bottom.graphics.drawRect(0, 50 * (MAX_ROW_COUNT - 1), 50 * (MAX_COLUMN_COUNT + 1), 20)
        this.addChild(bottom)

        let left = new createjs.Shape()
        left.graphics.beginFill(color)
        left.graphics.drawRect(0, 0, FRAME_LEFT, 50 * MAX_ROW_COUNT + 25)
        this.addChild(left)

        let right = new createjs.Shape()
        right.graphics.beginFill(color)
        right.graphics.drawRect(FRAME_LEFT + 5 + (50 * MAX_COLUMN_COUNT), 0, FRAME_LEFT, 50 * MAX_ROW_COUNT + 25)
        this.addChild(right)




        let word = new createjs.Text("", "48px serif", "White");
        word.textAlign = "center";
        word.x = (50 * (MAX_COLUMN_COUNT + 1)) / 2
        word.y = (50 * (MAX_ROW_COUNT - 1)) / 2


    }
}