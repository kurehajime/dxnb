import { Suit, Color, State, MAX_ROW_COUNT, MAX_COLUMN_COUNT } from "../params";
export class Shadow extends createjs.Container {
    private _isLive = false

    public set IsLive(value: boolean) {
        this._isLive = value;
        this.Draw()
    }
    public get IsLive() {
        return this._isLive
    }

    public constructor() {
        super()
        this.Draw()
    }

    public Draw() {
        this.removeAllChildren()
        if (this._isLive) {
            let shape1 = new createjs.Shape()
            shape1.graphics.beginFill("White")
            shape1.graphics.drawRoundRect(5, 5, 45, 45, 5)
            shape1.alpha = 0.3
            this.children.push(shape1)
        }
    }
}