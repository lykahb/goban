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

import type { GobanBase } from "../../src/GobanBase";
import { callbacks, setGobanCallbacks } from "../../src/Goban/callbacks";
import { THEMES } from "../../src/Goban/themes";

function makeDefs(): SVGDefsElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "defs");
}

describe("custom image stones", () => {
    afterEach(() => {
        delete callbacks.customBlackStoneUrls;
        delete callbacks.customWhiteStoneUrls;
        delete callbacks.customBlackStoneUrl;
        delete callbacks.customWhiteStoneUrl;
        delete callbacks.customBlackStoneColor;
        delete callbacks.customWhiteStoneColor;
        callbacks.customBlackStoneUrls = () => [];
        callbacks.customWhiteStoneUrls = () => [];
        jest.restoreAllMocks();
    });

    test("creates one SVG definition per normalized URL", () => {
        callbacks.customBlackStoneUrls = () => [" first.png ", "", "second.png", "first.png"];
        const theme = new THEMES.black.Custom();
        const defs = makeDefs();

        const stones = theme.preRenderBlackSVG(defs, 10, 1, () => undefined);

        expect(stones).toHaveLength(2);
        expect(
            Array.from(defs.querySelectorAll("image")).map((image) =>
                image.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
            ),
        ).toEqual(["first.png", "second.png"]);
    });

    test("adapts the legacy singular callback", () => {
        setGobanCallbacks({ customWhiteStoneUrl: () => "white.png" });
        const theme = new THEMES.white.Custom();
        const defs = makeDefs();

        const stones = theme.preRenderWhiteSVG(defs, 10, 1, () => undefined);

        expect(stones).toHaveLength(1);
        expect(
            defs.querySelector("image")?.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
        ).toBe("white.png");
    });

    test("replaces a failed SVG image with a solid stone", () => {
        callbacks.customBlackStoneUrls = () => ["broken.png"];
        callbacks.customBlackStoneColor = () => "#123456";
        const theme = new THEMES.black.Custom();
        const defs = makeDefs();
        theme.preRenderBlackSVG(defs, 10, 1, () => undefined);

        defs.querySelector("image")?.dispatchEvent(new Event("error"));

        expect(defs.querySelector("image")).toBeNull();
        expect(defs.querySelector("circle")?.getAttribute("fill")).toBe("#123456");
    });

    test("keeps a random arrangement stable within each goban", () => {
        let random_value = 0.1;
        jest.spyOn(Math, "random").mockImplementation(() => random_value);
        const theme = new THEMES.black.Custom();
        const stones = ["one", "two", "three", "four"];
        const first_goban = { engine: { width: 19, height: 19 } } as unknown as GobanBase;
        const second_goban = { engine: { width: 19, height: 19 } } as unknown as GobanBase;

        const first_layout = Array.from({ length: 19 }, (_, x) =>
            Array.from({ length: 19 }, (_, y) => theme.getStone(x, y, stones, first_goban)),
        );
        const repeated_layout = Array.from({ length: 19 }, (_, x) =>
            Array.from({ length: 19 }, (_, y) => theme.getStone(x, y, stones, first_goban)),
        );
        random_value = 0.8;
        const second_layout = Array.from({ length: 19 }, (_, x) =>
            Array.from({ length: 19 }, (_, y) => theme.getStone(x, y, stones, second_goban)),
        );

        expect(repeated_layout).toEqual(first_layout);
        expect(second_layout).not.toEqual(first_layout);
        expect(theme.getStone(4, 7, stones, first_goban)).toBe("one");
        expect(theme.getStone(4, 7, stones, second_goban)).toBe("four");
    });

    test("reinitializes the random arrangement when a goban changes board size", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.1);
        const theme = new THEMES.black.Custom();
        const stones = ["one", "two"];
        const goban = { engine: { width: 2, height: 2 } } as unknown as GobanBase;

        expect(theme.getStone(1, 1, stones, goban)).toBe("one");

        (goban as unknown as { engine: { width: number; height: number } }).engine = {
            width: 3,
            height: 3,
        };

        expect(theme.getStone(2, 2, stones, goban)).toBe("one");
    });
});
