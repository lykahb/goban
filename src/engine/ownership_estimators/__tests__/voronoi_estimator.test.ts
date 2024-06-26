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

import { voronoi_estimate_ownership } from "../voronoi_estimator";

test("one color only scores board for that color", () => {
    const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ];

    expect(voronoi_estimate_ownership(board)).toEqual([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ]);
});

test("border is one stone wide", () => {
    const board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, -1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    expect(voronoi_estimate_ownership(board)).toEqual([
        [1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 0, -1],
        [1, 1, 1, 0, -1, -1],
        [1, 1, 0, -1, -1, -1],
        [1, 0, -1, -1, -1, -1],
        [0, -1, -1, -1, -1, -1],
    ]);
});
