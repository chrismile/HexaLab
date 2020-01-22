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

THREE.LinkedListGather = {

    vertexShader: [
        "#version 310 es",
        "layout(location = 0) in vec3 vPosition;",
        "layout(location = 1) in vec3 vNormal;",
        "layout(location = 2) in vec3 vColor;",
        "out vec3 fWorldPosition;",
        "out vec3 fNormal;",
        "out vec3 fColor;",

        "void main() {",
            "vPosition = (modelMatrix * vec4(vPosition, 1.0)).xyz;",
            "fNormal = vNormal;",
            "fColor = vColor;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);",
        "}\n"

    ].join( "\n" ),

    fragmentShader: [
        "#version 310 es\n"
    ].join( "\n" ).concat(THREE.LinkedListHeader.code).concat( [
        "in vec3 fWorldPosition;",
        "in vec3 fNormal;",
        "in vec3 fColor;",
        "out vec4 fragColor;",

        "void gatherFragment(vec4 color) {",
            "int x = int(gl_FragCoord.x);",
            "int y = int(gl_FragCoord.y);",
            "int pixelIndex = viewportW * y + x;",
            
            "LinkedListFragmentNode frag;",
            "frag.color = packUnorm4x8(color);",
            "frag.depth = gl_FragCoord.z;",
            "frag.next = -1;",

            "uint insertIndex = atomicCounterIncrement(fragCounter);",

            "if (insertIndex < linkedListSize) {",
                // Insert the fragment into the linked list
                "frag.next = atomicExchange(startOffset[pixelIndex], insertIndex);",
                "fragmentBuffer[insertIndex] = frag;",
            "}",
        "}",

        "void main() {",
            // TODO: Currently, alpha is hardcoded.
            "vec4 colorAttribute = vec4(fColor, 0.1);",

            // Blinn-Phong Shading
            "const vec3 lightColor = vec3(1,1,1);",
            "const vec3 ambientColor = colorAttribute.rgb;",
            "const vec3 diffuseColor = ambientColor;",
            "vec3 phongColor = vec3(0);",

            "const float kA = 0.2;",
            "const vec3 Ia = kA * ambientColor;",
            "const float kD = 0.7;",
            "const float kS = 0.1;",
            "const float s = 10;",

            "const vec3 n = normalize(fNormal);",
            "const vec3 v = normalize(cameraPosition - fWorldPosition);",
            "const vec3 l = v;",
            "const vec3 h = normalize(v + l);",

            "vec3 Id = kD * clamp(abs(dot(n, l)), 0.0, 1.0) * diffuseColor;",
            "vec3 Is = kS * pow(clamp(abs(dot(n, h)), 0.0, 1.0), s) * lightColor;",

            "phongColor = Ia + Id + Is;",

            "vec4 color = vec4(phongColor, colorAttribute.a);",
            "gatherFragment(color);",
        "}\n",
    ].join( "\n" ) )

};
