import {
    Suit, Color, State
    , MAX_ROW_COUNT, MAX_COLUMN_COUNT, PROGRESS_SPAN, STEP_SPAN, FRAME_TOP, FRAME_LEFT, END_OF_TIME
} from "./params";
import { Cell } from "./Components/cell";
import { Frame } from "./Components/frame";
import { Shadow } from "./Components/shadow";
import { Cover } from "./Components/cover";
import { Score } from "./Components/score";
import { Utils } from "./utils";
import { EventManager } from "./eventManager";
import { UpButton } from "./Components/up";
import { LeftPoint } from "./Components/leftPoint";
import { Bg } from "./Components/bg";

export class Game {
    private stage: createjs.Stage
    private hold: Cell = null
    private eventManager: EventManager = new EventManager()
    private progress = 0
    private progressBySpeed = 0
    private step = 0
    private stepIncrement: boolean = false
    private time = 0
    private stopTime = 0
    private field: createjs.Container
    private shadow: Shadow
    private cover: Cover
    private score: Score
    private upButton: UpButton
    private leftPoint: LeftPoint

    private point: number = 0
    private isGameOver: boolean = false
    private startTime: number = 0


    private soundSource = [
        { src: "./bgm.m4a", id: "bgm" },
        { src: "./swap.mp3", id: "swap" },
        { src: "./break.mp3", id: "break" },
    ];
    private sounds: { [name: string]: createjs.AbstractSoundInstance } = {}

    constructor() {
        this.stage = new createjs.Stage("canvas")
    }

    public Start() {
        this.initDraw()
        this.upButton.addEventListener("mousedown", () => {
            this.up()
        })

        // 音声読み込み
        createjs.Sound.addEventListener("fileload", (event: any) => {
            this.sounds[event.id] = createjs.Sound.createInstance(event.id);
        });
        createjs.Sound.registerSounds(this.soundSource);

        // 最初のマウスクリックでTickを起動
        this.cover.addEventListener("mousedown", (e: MouseEvent) => {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", (e: createjs.TickerEvent) => { this.handleTick(e) });
            this.sounds["bgm"]?.setLoop(-1)
            this.sounds["bgm"]?.setVolume(0.3)
            this.sounds["bgm"]?.play()
            this.cover.UnDraw()
            this.cover.removeAllEventListeners()
        });

    }

    //#region Tick

    private handleTick(e: createjs.TickerEvent) {
        this.update(e)
        this.eventManager.Tick(e.time)
        this.drawStage(e)
    }

    private update(e: createjs.TickerEvent) {

        // ゲーム開始からの時間
        if (this.startTime === 0) {
            this.startTime = e.time
        }
        let delta = Math.max(e.delta - this.stopTime, 0)
        this.stopTime = Math.max(this.stopTime - e.delta, 0)
        this.time += delta
        let progressPer = this.time / END_OF_TIME
        if (delta === 0) {
            return
        }

        // ゲームオーバー判定
        if (progressPer > 1) {
            this.gameOver()
        }


        if (!this.isGameOver) {
            let progress_span = Math.max(10, PROGRESS_SPAN - (PROGRESS_SPAN * progressPer))
            this.progress = this.progress + Math.round(delta)
            this.progressBySpeed = Math.round(this.progress / progress_span)

            this.stepIncrement = (this.step !== Math.floor(this.progressBySpeed / STEP_SPAN))
            this.step = Math.floor(this.progressBySpeed / STEP_SPAN)
            if (this.stepIncrement) {
                this.up()
                this.leftPoint.Draw()
            }
        }
    }

    private drawStage(e: createjs.TickerEvent) {
        // せり上げる
        this.field.y = - (this.progressBySpeed % STEP_SPAN)
        this.leftPoint.y = - (this.progressBySpeed % STEP_SPAN)
        // ゲームオーバー判定
        if (this.checkGameOver()) {
            this.gameOver()
        }
        this.stage.update()
    }

    //#endregion

    //#region GameControl

    // 消去判定
    private check() {
        let cells = this.getCells()
        for (let r = 0; r < MAX_ROW_COUNT; r++) {
            let suitBool = Utils.CheckSuit(cells[r])
            let colorBool = Utils.CheckColor(cells[r])
            if (suitBool || colorBool) {
                if (cells[r][0].State !== State.Flash && cells[r][0].State !== State.Delete) {
                    cells[r].forEach(x => {
                        x.State = State.Flash
                    })
                    this.point += 1
                    this.stopTime += (MAX_ROW_COUNT - Utils.GetTopRowNumber(this.getCells()) - 2) * 500

                    let row = cells[r]
                    let suit = suitBool ? row[0].Suit : null
                    let color = colorBool ? row[0].Color : null
                    this.eventManager.SetEvent(500, () => {
                        this.clearLock(cells, r, suit, color)
                        row.forEach(x => {
                            x.State = State.Delete
                        })
                        this.defrag()
                    })
                }
            }
        }
        this.drawAll()
    }

    // 削除可能ブロックを消して詰める
    private defrag() {
        let point = Utils.Defrag(this.getCells())
        if (point > 0) {
            this.sounds["break"]?.play()
            Utils.Shake(this.field)
        }
        this.drawAll()
    }
    private clearLock(cells: Cell[][], lineNumber: number, suit: Suit, color: Color) {
        Utils.GetCellArray(cells).forEach(x => {
            if (x.Suit === suit || x.Color === color) {
                if (x.State === State.Lock) {
                    // x.State = State.PreLock
                } else if (x.State === State.PreLock) {
                    x.State = State.Live
                }
            }
        })
    }

    // ブロックの繰り上げ
    private up() {
        let cells = this.getCells()
        for (let r = 0; r < MAX_ROW_COUNT - 1; r++) {
            for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                cells[r][c].Override(cells[r + 1][c])
            }
        }
        Utils.ShuffleLine(cells[MAX_ROW_COUNT - 1])
        if (this.hold) {
            if (this.hold.Row === 0) {
                this.hold = null
            } else {
                this.hold = cells[this.hold.Row - 1][this.hold.Column]
            }
        }
        this.leftPoint.Increment()
        this.drawAll()
    }

    // ブロックの入れ替え
    private swap(target: Cell) {
        this.field.children.forEach(x => {
            if (x instanceof Cell) {
                x.IsHold = false
                x.Draw()
            }
        })
        if (target.State !== State.Live && target.State !== State.PreLock) {
            return
        }

        if (this.hold) {
            if (this.hold.State !== State.Live && this.hold.State !== State.PreLock) {
                return
            }
            if (this.hold !== target) {
                if (this.hold.Color === target.Color || this.hold.Suit === target.Suit) {
                    let color = target.Color
                    let suit = target.Suit
                    let state = target.State

                    target.Color = this.hold.Color
                    target.Suit = this.hold.Suit
                    target.State = this.hold.State

                    this.hold.Color = color
                    this.hold.Suit = suit
                    this.hold.State = state

                    // target.State = target.State === State.PreLock ? State.Lock : State.PreLock
                    // this.hold.State = this.hold.State === State.PreLock ? State.Lock : State.PreLock

                    // 影
                    this.shadow.IsLive = true
                    this.shadow.x = this.hold.x
                    this.shadow.y = this.hold.y
                    this.eventManager.SetEvent(300, () => {
                        this.shadow.IsLive = false
                    })
                    createjs.Tween.get(this.shadow)
                        .to({ x: target.x, y: target.y }, 100)


                    this.check()
                    this.sounds["swap"]?.play()
                }
            }
            this.hold.IsHold = false
            this.hold = null
        } else {
            this.hold = target
            this.hold.IsHold = true
        }
        this.drawAll()
    }

    // ゲームオーバー
    private gameOver() {
        this.isGameOver = true
        this.sounds["bgm"]?.stop()
        this.score.Draw(this.point)
    }

    //#endregion

    //#region Util

    private getCells(): Cell[][] {
        let cells: Cell[][] = []
        for (let r = 0; r < MAX_ROW_COUNT; r++) {
            for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                let cell = this.field.children.find(x => x instanceof Cell && x.Row === r && x.Column === c) as Cell
                if (!cells[r]) {
                    cells[r] = []
                }
                cells[r][c] = cell
            }
        }
        return cells
    }

    private checkGameOver(): boolean {
        let cells = this.getCells()
        let topCell: Cell = null
        for (let r = 0; r < 2; r++) {
            if (cells[r][0].State === State.Live) {
                topCell = cells[r][0]
                break
            }
        }
        if (topCell !== null) {
            var point = topCell.localToGlobal(0, 0)
            if (point.y < FRAME_TOP) {
                return true
            }
        }

        return false
    }

    //#endregion

    //#region Draw

    // 初期描画
    private initDraw() {
        let field = new createjs.Container()
        field.name = "field"
        this.field = field
        this.field.x = FRAME_LEFT
        this.field.y = 0
        for (let r = 0; r < MAX_ROW_COUNT; r++) {
            for (let c = 0; c < MAX_COLUMN_COUNT; c++) {
                let color: Color = Math.floor(Math.random() * 3)
                let suit: Suit = Math.floor(Math.random() * 3)
                let cell = new Cell(suit, color)
                //Utils.ChangeWild(cell)
                cell.Row = r
                cell.Column = c
                cell.x = c * 50
                cell.y = r * 50
                if (r < 5) {
                    cell.State = State.Delete
                }
                cell.addEventListener("mousedown", (e: MouseEvent) => {
                    this.onClick(e)
                });
                field.addChild(cell)
            }
        }
        this.shadow = new Shadow()
        field.addChild(this.shadow)

        this.cover = new Cover()
        this.score = new Score()
        this.leftPoint = new LeftPoint()
        this.upButton = new UpButton()
        this.stage.addChild(new Bg())
        this.stage.addChild(this.upButton)
        this.stage.addChild(field)
        this.stage.addChild(new Frame())
        this.stage.addChild(this.leftPoint)
        this.stage.addChild(this.cover)
        this.stage.addChild(this.score)
        this.drawAll()
        this.stage.update()
    }

    private drawAll() {
        Utils.GetCellArray(this.getCells()).forEach(cell => {
            cell.Draw()
        });
    }

    //#endregion

    //#region Events

    private onClick(e: MouseEvent) {
        let target = e.currentTarget as Cell
        if (!this.isGameOver) {
            if (this.sounds["bgm"]?.getPosition() === 0) {
                this.sounds["bgm"]?.setVolume(0.3)
                this.sounds["bgm"]?.setLoop(-1)
                //this.sounds["bgm"]?.play()
            }
            this.swap(target)
        }
    }

    //#endregion

}
