export class EventManager {
    public Time: number
    private actions: EventAction[] = []

    public constructor() {

    }

    public SetEvent(after: number, action: () => (void)) {
        this.actions.push(new EventAction(this.Time + after, action))
    }
    public Tick(time: number) {
        this.Time = time
        for (const action of this.actions) {
            if (action.FireTime < this.Time) {
                action.Action()
                action.Done = true
            }
        }
        this.actions = this.actions.filter(x => x.Done === false)
    }
}

class EventAction {
    public FireTime: number
    public Action: () => (void)
    public Done: boolean = false
    public constructor(fireTime: number, action: () => (void)) {
        this.FireTime = fireTime
        this.Action = action
    }
}