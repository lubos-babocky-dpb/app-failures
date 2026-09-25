import { liveQuery } from "dexie";
import { watchableMixin } from "./watchable-mixin";
import { BaseRepository } from "./base-repository";

export class WatchableRepository extends watchableMixin(BaseRepository)
{
    
}