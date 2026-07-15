/*
 * Copyright (C) Online-Go.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { GobanBase } from "../GobanBase";
import { GobanSelectedThemes } from "./Goban";

export interface GobanCallbacks {
    defaultConfig?: () => any;
    getCoordinateDisplaySystem?: () => "A1" | "1-1";
    isAnalysisDisabled?: (goban: GobanBase, perGameSettingAppliesToNonPlayers: boolean) => boolean;

    getClockDrift?: () => number;
    getNetworkLatency?: () => number;
    getLocation?: () => string;
    // getShowMoveNumbers?: () => boolean;
    getShowVariationMoveNumbers?: () => boolean;
    getStoneFontScale?: () => number;
    getLastMoveCrosshair?: () => { enabled: boolean; color: string; thickness: number };
    getFuzzyPlacementEnabled?: () => boolean;
    getShowUndoRequestIndicator?: () => boolean;
    getMoveTreeNumbering?: () => "move-coordinates" | "none" | "move-number";
    getCDNReleaseBase?: () => string;
    getSoundEnabled?: () => boolean;
    getSoundVolume?: () => number;

    watchSelectedThemes?: (cb: (themes: GobanSelectedThemes) => void) => { remove: () => any };
    getSelectedThemes?: () => GobanSelectedThemes;

    customBlackStoneColor?: () => string;
    customBlackTextColor?: () => string;
    customWhiteStoneColor?: () => string;
    customWhiteTextColor?: () => string;
    customBoardColor?: () => string;
    customBoardLineColor?: () => string;
    customBoardLabelColor?: () => string;
    customBoardUrl?: () => string;
    customBlackStoneUrls?: () => string[];
    customWhiteStoneUrls?: () => string[];
    /** @deprecated Use customBlackStoneUrls instead. */
    customBlackStoneUrl?: () => string;
    /** @deprecated Use customWhiteStoneUrls instead. */
    customWhiteStoneUrl?: () => string;

    canvasAllocationErrorHandler?: (
        note: string | null,
        error: Error,
        extra: {
            total_allocations_made: number;
            total_pixels_allocated: number;
            width?: number | string;
            height?: number | string;
        },
    ) => void;

    addCoordinatesToChatInput?: (coordinates: string) => void;
    updateScoreEstimation?: (
        est_winning_color: "black" | "white",
        number_of_points: number,
    ) => void;

    toast?: (message_id: string, duration: number) => void;
}

function legacyBlackStoneUrls(): string[] {
    const url = callbacks.customBlackStoneUrl?.().trim();
    return url ? [url] : [];
}

function legacyWhiteStoneUrls(): string[] {
    const url = callbacks.customWhiteStoneUrl?.().trim();
    return url ? [url] : [];
}

export const callbacks: GobanCallbacks = {
    getClockDrift: () => 0,
    customBlackStoneUrls: legacyBlackStoneUrls,
    customWhiteStoneUrls: legacyWhiteStoneUrls,
};

/**
 * Set's callback functions to be called in various situations. You can set any
 * or all of the callbacks, only the provided callbacks will be updated.
 */
export function setGobanCallbacks(newCallbacks: GobanCallbacks): void {
    // This is a partial update, so only restore a legacy shim when its singular callback is supplied.
    if (newCallbacks.customBlackStoneUrl && !newCallbacks.customBlackStoneUrls) {
        callbacks.customBlackStoneUrls = legacyBlackStoneUrls;
    }
    if (newCallbacks.customWhiteStoneUrl && !newCallbacks.customWhiteStoneUrls) {
        callbacks.customWhiteStoneUrls = legacyWhiteStoneUrls;
    }

    for (const key in newCallbacks) {
        if (newCallbacks[key as keyof GobanCallbacks] !== undefined) {
            callbacks[key as keyof GobanCallbacks] = newCallbacks[
                key as keyof GobanCallbacks
            ] as any;
        }
    }
}
