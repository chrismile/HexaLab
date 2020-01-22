/*
 * BSD 2-Clause License
 *
 * Copyright (c) 2020, Christoph Neuhauser
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

THREE.LinkedListResolve = {

    vertexShader: [
        "#version 310 es",
        "layout(location = 0) in vec3 vPosition;",

        "void main() {",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);",
        "}\n"

    ].join( "\n" ),

    fragmentShader: [
        "#version 310 es",
        "#define sortingAlgorithm frontToBackPQ",
        "#define MAX_NUM_FRAGS 256",
        "uint colorList[MAX_NUM_FRAGS];",
        "float depthList[MAX_NUM_FRAGS];\n",
    ].join( "\n" ).concat(THREE.LinkedListHeader.code).concat(THREE.LinkedListSort.code).concat( [
        "out vec4 fragColor;",

        "void main() {",
            "int x = int(gl_FragCoord.x);",
            "int y = int(gl_FragCoord.y);",
            "int pixelIndex = viewportW * y + x;",

            // Get start offset from array
            "uint fragOffset = startOffset[pixelIndex];",

            // Collect all fragments for this pixel
            "int numFrags = 0;",
            "LinkedListFragmentNode fragment;",
            "for (int i = 0; i < MAX_NUM_FRAGS; i++) {",
                "if (fragOffset == -1) {",
                    // End of list reached
                    "break;",
                "}",

                "fragment = fragmentBuffer[fragOffset];",
                "fragOffset = fragment.next;",

                "colorList[i] = fragment.color;",
                "depthList[i] = fragment.depth;",

                "numFrags++;",
            "}",

            "if (numFrags == 0) {",
                "discard;",
            "}",

            "fragColor = sortingAlgorithm(numFrags);",
        "}\n",
    ].join( "\n" ) )

};
