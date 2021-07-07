import { Suit, Color, State, MAX_ROW_COUNT, MAX_COLUMN_COUNT, COLOR_RED, COLOR_WHITE, COLOR_BLUE, COLOR_GREEN } from "../params";

export class Cell extends createjs.Container {
    public Row: number
    public Column: number
    public Suit: Suit
    public Color: Color
    public State: State = State.Live
    public IsHold: boolean = false
    public Life = 0

    public constructor(suit: Suit, color: Color) {
        super()
        this.Suit = suit
        this.Color = color
        this.Draw()
    }

    public Draw() {
        let suit: string
        let color: string
        this.removeAllChildren()
        if (this.State === State.Delete) {
            return
        }

        switch (this.Suit) {
            case Suit.North:
                suit = "北"
                break;
            case Suit.East:
                suit = "東"
                break;
            case Suit.West:
                suit = "西"
                break;
            case Suit.South:
                suit = "南"
                break;
            case Suit.Wild:
                suit = "＊"
                break;
            default:
                break;
        }
        switch (this.Color) {
            case Color.Red:
                color = COLOR_RED
                break;
            case Color.White:
                color = COLOR_WHITE
                break;
            case Color.Blue:
                color = COLOR_BLUE
                break;
            case Color.Green:
                color = COLOR_GREEN
                break;

            case Color.Rainbow:
                color = "Black"
                break;
            default:
                break;
        }
        let shape1;
        if (this.Color !== Color.Rainbow) {
            shape1 = new createjs.Shape()
            shape1.graphics.beginFill(color)
        } else {
            let colors = ["#5EBD3E", "#FFB900", "#F78200", "#E23838", "#973999", "#009CDF"];
            let ratios = [0, 0.2, 0.4, 0.6, 0.8, 1];
            shape1 = new createjs.Shape(new createjs.Graphics().beginLinearGradientFill(colors, ratios, 0, 0, 0, 50))
        }
        if (this.IsHold) {
            shape1.graphics.beginStroke("#FFFFFF77");
            shape1.graphics.setStrokeStyle(3);
        }

        shape1.graphics.drawRoundRect(5, 5, 45, 45, 5)
        if (this.IsHold) {
            var shadow = new createjs.Shadow("#ffffff", 0, 0, 15);
            shape1.shadow = shadow;
        }

        let foreColor = "Black"
        let word = new createjs.Text(suit, "bold 24px serif", foreColor);
        word.textAlign = "center";
        word.x = 27
        word.y = 15
        if (this.State === State.Flash) {
            this.alpha = 0.7
        } else {
            this.alpha = 1
        }

        let markStr = ""
        if (this.State === State.PreLock) {
            markStr = "○"
        }

        if (this.State === State.Lock) {
            markStr = "●"
        }
        let mark = new createjs.Text(markStr, "bold 12px serif", foreColor);
        mark.textAlign = "center";
        mark.x = 40
        mark.y = 30

        this.addChild(shape1)
        this.addChild(word)
        this.addChild(mark)
    }
    public Override(cell: Cell) {
        this.Suit = cell.Suit
        this.Color = cell.Color
        this.State = cell.State
        this.IsHold = cell.IsHold
    }
}
