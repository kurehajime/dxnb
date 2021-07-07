import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT
} from "../params";
export class LeftPoint extends createjs.Container {
    private baseLine: number = 5
    private point: number = 0
    private count: number = 0
    public constructor() {
        super()
        this.calc()
        this.Draw()
    }
    public Increment() {
        this.count++
        this.calc()
        this.Draw()
    }
    private calc() {
        this.baseLine = 5 - (this.count % 5)
        this.point = 5 * Math.floor(this.count / 5)
    }

    public Draw() {
        this.removeAllChildren()


        for (let i = 1; i <= 5; i++) {
            let point = new createjs.Text("-", "12px serif", "White");
            point.textAlign = "right";
            point.x = FRAME_LEFT - 3
            point.y = (50 * (this.baseLine - 6 + i))
            this.addChild(point)
        }

        let point0 = new createjs.Text(this.point + "-", "12px serif", "White");
        point0.textAlign = "right";
        point0.x = FRAME_LEFT - 3
        point0.y = (50 * this.baseLine)
        this.addChild(point0)

        for (let i = 1; i <= 5; i++) {
            let point = new createjs.Text("-", "12px serif", "White");
            point.textAlign = "right";
            point.x = FRAME_LEFT - 3
            point.y = (50 * (this.baseLine + i))
            this.addChild(point)
        }


        let point5 = new createjs.Text((this.point + 5) + "-", "12px serif", "White");
        point5.textAlign = "right";
        point5.x = FRAME_LEFT - 3
        point5.y = (50 * (this.baseLine + 5))
        this.addChild(point5)

        for (let i = 1; i <= 4; i++) {
            let point = new createjs.Text("-", "12px serif", "White");
            point.textAlign = "right";
            point.x = FRAME_LEFT - 3
            point.y = (50 * (this.baseLine + 5 + i))
            this.addChild(point)
        }
    }
}