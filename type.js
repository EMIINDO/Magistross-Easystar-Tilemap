"use strict";

{
	const SDK = globalThis.SDK;
	const BEHAVIOR_CLASS = SDK.Behaviors.EasystarTilemap;

	BEHAVIOR_CLASS.Type = class EasystarTilemapType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}