(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,32326,e=>{"use strict";var t,r,a,i,o=e.i(43476),n=e.i(71645),s=e.i(75056),l=e.i(80931),c=e.i(90072);let m=n.forwardRef(({children:e,enabled:t=!0,speed:r=1,rotationIntensity:a=1,floatIntensity:i=1,floatingRange:o=[-.1,.1],autoInvalidate:s=!1,...m},u)=>{let f=n.useRef(null);n.useImperativeHandle(u,()=>f.current,[]);let d=n.useRef(1e4*Math.random());return(0,l.useFrame)(e=>{var n,l;if(!t||0===r)return;s&&e.invalidate();let m=d.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(m/4*r)/8*a,f.current.rotation.y=Math.sin(m/4*r)/8*a,f.current.rotation.z=Math.sin(m/4*r)/20*a;let u=Math.sin(m/4*r)/10;u=c.MathUtils.mapLinear(u,-.1,.1,null!=(n=null==o?void 0:o[0])?n:-.1,null!=(l=null==o?void 0:o[1])?l:.1),f.current.position.y=u*i,f.current.updateMatrix()}),n.createElement("group",m,n.createElement("group",{ref:f,matrixAutoUpdate:!1},e))});var u=e.i(31067),f=c,d=e.i(20886),d=d,h=d;let p=parseInt(c.REVISION.replace(/\D+/g,""));class v extends f.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${p>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}}let g=e=>e&&e.constructor===Float32Array,x=e=>e instanceof f.Vector2||e instanceof f.Vector3||e instanceof f.Vector4,y=e=>Array.isArray(e)?e:x(e)?e.toArray():[e,e,e];function M(e,t,r){return n.useMemo(()=>{if(void 0!==t)if(g(t))return t;else{if(t instanceof f.Color){let r=Array.from({length:3*e},()=>[t.r,t.g,t.b]).flat();return Float32Array.from(r)}if(x(t)||Array.isArray(t)){let r=Array.from({length:3*e},()=>y(t)).flat();return Float32Array.from(r)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},r)},[t])}let S=n.forwardRef(({noise:e=1,count:t=100,speed:r=1,opacity:a=1,scale:i=1,size:o,color:s,children:c,...m},p)=>{n.useMemo(()=>(0,d.e)({SparklesImplMaterial:v}),[]);let x=n.useRef(null),S=(0,h.C)(e=>e.viewport.dpr),C=y(i),b=n.useMemo(()=>Float32Array.from(Array.from({length:t},()=>C.map(f.MathUtils.randFloatSpread)).flat()),[t,...C]),j=M(t,o,Math.random),F=M(t,a),R=M(t,r),w=M(3*t,e),A=M(void 0===s?3*t:t,g(s)?s:new f.Color(s),()=>1);return(0,l.useFrame)(e=>{x.current&&x.current.material&&(x.current.material.time=e.clock.elapsedTime)}),n.useImperativeHandle(p,()=>x.current,[]),n.createElement("points",(0,u.default)({key:`particle-${t}-${JSON.stringify(i)}`},m,{ref:x}),n.createElement("bufferGeometry",null,n.createElement("bufferAttribute",{attach:"attributes-position",args:[b,3]}),n.createElement("bufferAttribute",{attach:"attributes-size",args:[j,1]}),n.createElement("bufferAttribute",{attach:"attributes-opacity",args:[F,1]}),n.createElement("bufferAttribute",{attach:"attributes-speed",args:[R,1]}),n.createElement("bufferAttribute",{attach:"attributes-color",args:[A,3]}),n.createElement("bufferAttribute",{attach:"attributes-noise",args:[w,3]})),c||n.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:S,depthWrite:!1}))});var C=c,d=d,h=d;function b(e,t,r){let a=(0,h.C)(e=>e.size),i=(0,h.C)(e=>e.viewport),o="number"==typeof e?e:a.width*i.dpr,s="number"==typeof t?t:a.height*i.dpr,l=("number"==typeof e?r:e)||{},{samples:m=0,depth:u,...f}=l,d=null!=u?u:l.depthBuffer,p=n.useMemo(()=>{let e=new c.WebGLRenderTarget(o,s,{minFilter:c.LinearFilter,magFilter:c.LinearFilter,type:c.HalfFloatType,...f});return d&&(e.depthTexture=new c.DepthTexture(o,s,c.FloatType)),e.samples=m,e},[]);return n.useLayoutEffect(()=>{p.setSize(o,s),m&&(p.samples=m)},[m,p,o,s]),n.useEffect(()=>()=>p.dispose(),[]),p}var j=c;let F=(t={},r="void main() { }",a="void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }",(i=class extends j.ShaderMaterial{constructor(e){for(const i in super({vertexShader:r,fragmentShader:a,...e}),t)this.uniforms[i]=new j.Uniform(t[i]),Object.defineProperty(this,i,{get(){return this.uniforms[i].value},set(e){this.uniforms[i].value=e}});this.uniforms=j.UniformsUtils.clone(this.uniforms)}}).key=j.MathUtils.generateUUID(),i);class R extends C.MeshPhysicalMaterial{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new C.Color("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=r=>{r.uniforms={...r.uniforms,...this.uniforms},this.anisotropy>0&&(r.defines.USE_ANISOTROPY=""),t?r.defines.USE_SAMPLER="":r.defines.USE_TRANSMISSION="",r.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+r.fragmentShader,r.fragmentShader=r.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
            // Direction of refracted light.
            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
            // Compute rotation-independant scaling of the model matrix.
            vec3 modelScale;
            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
            if ( isinf( attenuationDistance ) ) {
              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
              return radiance;
            } else {
              // Compute light attenuation using Beer's law.
              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
              return transmittance * radiance;
            }
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in vec3 attenuationColor, const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
            // Get the specular component.
            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),r.fragmentShader=r.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        vec3 pos = vWorldPosition;
        float runningSeed = 0.0;
        vec3 v = normalize( cameraPosition - pos );
        vec3 n = inverseTransformDirection( normal, viewMatrix );
        vec3 transmission = vec3(0.0);
        float transmissionR, transmissionB, transmissionG;
        float randomCoords = rand(runningSeed++);
        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
        vec3 distortionNormal = vec3(0.0);
        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
        if (distortion > 0.0) {
          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
        }
        for (float i = 0.0; i < ${e}.0; i ++) {
          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
          transmissionR = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).r;
          transmissionG = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${e})) , material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).g;
          transmissionB = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${e})), material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).b;
          transmission.r += transmissionR;
          transmission.g += transmissionG;
          transmission.b += transmissionB;
        }
        transmission /= ${e}.0;
        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let w=n.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:r=!1,side:a=C.FrontSide,transmission:i=1,thickness:o=0,backsideThickness:s=0,backsideEnvMapIntensity:c=1,samples:m=10,resolution:f,backsideResolution:h,background:p,anisotropy:v,anisotropicBlur:g,...x},y)=>{let M,S,j,w;(0,d.e)({MeshTransmissionMaterial:R});let A=n.useRef(null),[I]=n.useState(()=>new F),T=b(h||f),E=b(f);return(0,l.useFrame)(e=>{if(A.current.time=e.clock.elapsedTime,A.current.buffer===E.texture&&!t){var i;(w=null==(i=A.current.__r3f.parent)?void 0:i.object)&&(j=e.gl.toneMapping,M=e.scene.background,S=A.current.envMapIntensity,e.gl.toneMapping=C.NoToneMapping,p&&(e.scene.background=p),w.material=I,r&&(e.gl.setRenderTarget(T),e.gl.render(e.scene,e.camera),w.material=A.current,w.material.buffer=T.texture,w.material.thickness=s,w.material.side=C.BackSide,w.material.envMapIntensity=c),e.gl.setRenderTarget(E),e.gl.render(e.scene,e.camera),w.material=A.current,w.material.thickness=o,w.material.side=a,w.material.buffer=E.texture,w.material.envMapIntensity=S,e.scene.background=M,e.gl.setRenderTarget(null),e.gl.toneMapping=j)}}),n.useImperativeHandle(y,()=>A.current,[]),n.createElement("meshTransmissionMaterial",(0,u.default)({args:[m,t],ref:A},x,{buffer:e||E.texture,_transmission:i,anisotropicBlur:null!=g?g:v,transmission:t?i:0,thickness:o,side:a}))});function A({reduced:e=!1}){let t=(0,n.useRef)(null),r=(0,n.useRef)(null),a=(0,n.useRef)(null);(0,l.useFrame)(i=>{let o=i.clock.elapsedTime;t.current&&(t.current.rotation.y=c.MathUtils.lerp(t.current.rotation.y,.6*i.pointer.x,.04),t.current.rotation.x=c.MathUtils.lerp(t.current.rotation.x,-(.3*i.pointer.y),.04),t.current.position.y=.08*Math.sin(.6*o)),r.current&&(r.current.rotation.x=.25*o,r.current.rotation.y=.4*o),a.current&&!e&&(a.current.rotation.z=.15*o)});let i=(0,n.useMemo)(()=>[{pos:[0,1.25,0],scale:.13},{pos:[0,-1.25,0],scale:.13},{pos:[-1.55,0,0],scale:.18},{pos:[1.55,0,0],scale:.18},{pos:[0,0,0],scale:.28}],[]);return(0,o.jsx)(m,{speed:e?.5:1.1,rotationIntensity:e?.1:.35,floatIntensity:e?.1:.3,children:(0,o.jsxs)("group",{ref:t,scale:e?.6:.75,children:[(0,o.jsxs)("group",{ref:a,rotation:[0,0,0],children:[(0,o.jsxs)("mesh",{children:[(0,o.jsx)("torusGeometry",{args:[1.7,.045,24,128]}),(0,o.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.18,emissive:"#7a5a10",emissiveIntensity:.4})]}),(0,o.jsxs)("mesh",{children:[(0,o.jsx)("torusGeometry",{args:[1.78,.012,16,128]}),(0,o.jsx)("meshStandardMaterial",{color:"#F5C238",emissive:"#F5C238",emissiveIntensity:1.2,transparent:!0,opacity:.6})]})]}),(0,o.jsxs)("mesh",{children:[(0,o.jsx)("cylinderGeometry",{args:[.04,.04,2.5,16]}),(0,o.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.9,roughness:.2,emissive:"#5a4008",emissiveIntensity:.4})]}),(0,o.jsxs)("mesh",{rotation:[0,0,Math.PI/2],children:[(0,o.jsx)("cylinderGeometry",{args:[.04,.04,3.1,16]}),(0,o.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.9,roughness:.2,emissive:"#5a4008",emissiveIntensity:.4})]}),(0,o.jsxs)("mesh",{position:[-1.55,0,0],rotation:[Math.PI/2,0,0],children:[(0,o.jsx)("torusGeometry",{args:[.18,.035,16,48]}),(0,o.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.2,emissive:"#5a4008",emissiveIntensity:.5})]}),(0,o.jsxs)("mesh",{position:[1.55,0,0],rotation:[Math.PI/2,0,0],children:[(0,o.jsx)("torusGeometry",{args:[.18,.035,16,48]}),(0,o.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.2,emissive:"#5a4008",emissiveIntensity:.5})]}),i.map((e,t)=>(0,o.jsxs)("mesh",{position:e.pos,children:[(0,o.jsx)("sphereGeometry",{args:[e.scale,32,32]}),(0,o.jsx)("meshStandardMaterial",{color:"#F5C238",metalness:.6,roughness:.2,emissive:"#F5C238",emissiveIntensity:.7})]},t)),(0,o.jsxs)("mesh",{ref:r,position:[0,0,-.05],children:[(0,o.jsx)("icosahedronGeometry",{args:[.55,e?1:3]}),(0,o.jsx)(w,{color:"#F7E3A0",thickness:.35,roughness:.15,transmission:.85,ior:1.3,chromaticAberration:.04,backside:!0})]})]})})}e.s(["default",0,function({reduced:e=!1}){return(0,o.jsx)("div",{className:"absolute inset-0 pointer-events-none","aria-hidden":"true",children:(0,o.jsxs)(s.Canvas,{camera:{position:[0,0,8.5],fov:38},dpr:e?1:[1,2],performance:{min:.5},gl:{antialias:!e,alpha:!0,powerPreference:"high-performance"},children:[(0,o.jsx)("ambientLight",{intensity:.55}),(0,o.jsx)("directionalLight",{position:[3,4,5],intensity:1.6,color:"#FFE9B0"}),(0,o.jsx)("pointLight",{position:[-4,-2,3],intensity:1.2,color:"#4A85F6"}),(0,o.jsx)("pointLight",{position:[4,3,-2],intensity:.9,color:"#F5C238"}),(0,o.jsxs)(n.Suspense,{fallback:null,children:[(0,o.jsx)(A,{reduced:e}),!e&&(0,o.jsx)(S,{count:70,scale:[8,5,4],size:2.4,speed:.3,color:"#F5C238",opacity:.9})]})]})})}],32326)},80438,e=>{e.n(e.i(32326))}]);