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

/** Deep clones an object */
export function deepClone(obj: any): any {
    let ret: any;
    if (typeof obj === "object") {
        if (Array.isArray(obj)) {
            ret = [];
            for (let i = 0; i < obj.length; ++i) {
                ret.push(deepClone(obj[i]));
            }
        } else {
            ret = {};
            for (const i in obj) {
                ret[i] = deepClone(obj[i]);
            }
        }
    } else {
        return obj;
    }
    return ret;
}

/** Deep compares two objects */
export function deepEqual(a: any, b: any) {
    if (typeof a !== typeof b) {
        return false;
    }

    if (typeof a === "object") {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                if (a.length !== b.length) {
                    return false;
                }
                for (let i = 0; i < a.length; ++i) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            for (const i in a) {
                if (!(i in b)) {
                    return false;
                }
                if (!deepEqual(a[i], b[i])) {
                    return false;
                }
            }
            for (const i in b) {
                if (!(i in a)) {
                    return false;
                }
            }
        }
        return true;
    } else {
        return a === b;
    }
}
