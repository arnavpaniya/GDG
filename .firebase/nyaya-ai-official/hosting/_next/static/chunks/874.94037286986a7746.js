"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[874],{72874:(e,t,r)=>{r.r(t),r.d(t,{default:()=>C});var a=r(95155),i=r(12115),n=r(86717),o=r(30258),s=r(85339);let l=i.forwardRef(({children:e,enabled:t=!0,speed:r=1,rotationIntensity:a=1,floatIntensity:o=1,floatingRange:l=[-.1,.1],autoInvalidate:c=!1,...m},u)=>{let f=i.useRef(null);i.useImperativeHandle(u,()=>f.current,[]);let d=i.useRef(1e4*Math.random());return(0,n.D)(e=>{var i,n;if(!t||0===r)return;c&&e.invalidate();let m=d.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(m/4*r)/8*a,f.current.rotation.y=Math.sin(m/4*r)/8*a,f.current.rotation.z=Math.sin(m/4*r)/20*a;let u=Math.sin(m/4*r)/10;u=s.cj9.mapLinear(u,-.1,.1,null!=(i=null==l?void 0:l[0])?i:-.1,null!=(n=null==l?void 0:l[1])?n:.1),f.current.position.y=u*o,f.current.updateMatrix()}),i.createElement("group",m,i.createElement("group",{ref:f,matrixAutoUpdate:!1},e))});var c=r(88945);function m(e,t,r){let a=(0,n.C)(e=>e.size),o=(0,n.C)(e=>e.viewport),l="number"==typeof e?e:a.width*o.dpr,c="number"==typeof t?t:a.height*o.dpr,m=("number"==typeof e?r:e)||{},{samples:u=0,depth:f,...d}=m,p=null!=f?f:m.depthBuffer,h=i.useMemo(()=>{let e=new s.nWS(l,c,{minFilter:s.k6q,magFilter:s.k6q,type:s.ix0,...d});return p&&(e.depthTexture=new s.VCu(l,c,s.RQf)),e.samples=u,e},[]);return i.useLayoutEffect(()=>{h.setSize(l,c),u&&(h.samples=u)},[u,h,l,c]),i.useEffect(()=>()=>h.dispose(),[]),h}let u=function(e,t,r,a){var i;return(i=class extends s.BKk{constructor(a){for(let i in super({vertexShader:t,fragmentShader:r,...a}),e)this.uniforms[i]=new s.nc$(e[i]),Object.defineProperty(this,i,{get(){return this.uniforms[i].value},set(e){this.uniforms[i].value=e}});this.uniforms=s.LlO.clone(this.uniforms)}}).key=s.cj9.generateUUID(),i}({},"void main() { }","void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }");class f extends s.uSd{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new s.Q1f("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=r=>{r.uniforms={...r.uniforms,...this.uniforms},this.anisotropy>0&&(r.defines.USE_ANISOTROPY=""),t?r.defines.USE_SAMPLER="":r.defines.USE_TRANSMISSION="",r.fragmentShader=`
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
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let d=i.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:r=!1,side:a=s.hB5,transmission:o=1,thickness:l=0,backsideThickness:d=0,backsideEnvMapIntensity:p=1,samples:h=10,resolution:v,backsideResolution:x,background:g,anisotropy:y,anisotropicBlur:S,...M},C)=>{let b,j,w,R;(0,n.e)({MeshTransmissionMaterial:f});let F=i.useRef(null),[k]=i.useState(()=>new u),A=m(x||v),I=m(v);return(0,n.D)(e=>{if(F.current.time=e.clock.elapsedTime,F.current.buffer===I.texture&&!t){var i;(R=null==(i=F.current.__r3f.parent)?void 0:i.object)&&(w=e.gl.toneMapping,b=e.scene.background,j=F.current.envMapIntensity,e.gl.toneMapping=s.y_p,g&&(e.scene.background=g),R.material=k,r&&(e.gl.setRenderTarget(A),e.gl.render(e.scene,e.camera),R.material=F.current,R.material.buffer=A.texture,R.material.thickness=d,R.material.side=s.hsX,R.material.envMapIntensity=p),e.gl.setRenderTarget(I),e.gl.render(e.scene,e.camera),R.material=F.current,R.material.thickness=l,R.material.side=a,R.material.buffer=I.texture,R.material.envMapIntensity=j,e.scene.background=b,e.gl.setRenderTarget(null),e.gl.toneMapping=w)}}),i.useImperativeHandle(C,()=>F.current,[]),i.createElement("meshTransmissionMaterial",(0,c.A)({args:[h,t],ref:F},M,{buffer:e||I.texture,_transmission:o,anisotropicBlur:null!=S?S:y,transmission:t?o:0,thickness:l,side:a}))}),p=parseInt(s.sPf.replace(/\D+/g,""));class h extends s.BKk{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
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
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}}let v=e=>e&&e.constructor===Float32Array,x=e=>e instanceof s.I9Y||e instanceof s.Pq0||e instanceof s.IUQ,g=e=>Array.isArray(e)?e:x(e)?e.toArray():[e,e,e];function y(e,t,r){return i.useMemo(()=>{if(void 0!==t)if(v(t))return t;else{if(t instanceof s.Q1f){let r=Array.from({length:3*e},()=>[t.r,t.g,t.b]).flat();return Float32Array.from(r)}if(x(t)||Array.isArray(t)){let r=Array.from({length:3*e},()=>g(t)).flat();return Float32Array.from(r)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},r)},[t])}let S=i.forwardRef(({noise:e=1,count:t=100,speed:r=1,opacity:a=1,scale:o=1,size:l,color:m,children:u,...f},d)=>{i.useMemo(()=>(0,n.e)({SparklesImplMaterial:h}),[]);let p=i.useRef(null),x=(0,n.C)(e=>e.viewport.dpr),S=g(o),M=i.useMemo(()=>Float32Array.from(Array.from({length:t},()=>S.map(s.cj9.randFloatSpread)).flat()),[t,...S]),C=y(t,l,Math.random),b=y(t,a),j=y(t,r),w=y(3*t,e),R=y(void 0===m?3*t:t,v(m)?m:new s.Q1f(m),()=>1);return(0,n.D)(e=>{p.current&&p.current.material&&(p.current.material.time=e.clock.elapsedTime)}),i.useImperativeHandle(d,()=>p.current,[]),i.createElement("points",(0,c.A)({key:`particle-${t}-${JSON.stringify(o)}`},f,{ref:p}),i.createElement("bufferGeometry",null,i.createElement("bufferAttribute",{attach:"attributes-position",args:[M,3]}),i.createElement("bufferAttribute",{attach:"attributes-size",args:[C,1]}),i.createElement("bufferAttribute",{attach:"attributes-opacity",args:[b,1]}),i.createElement("bufferAttribute",{attach:"attributes-speed",args:[j,1]}),i.createElement("bufferAttribute",{attach:"attributes-color",args:[R,3]}),i.createElement("bufferAttribute",{attach:"attributes-noise",args:[w,3]})),u||i.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:x,depthWrite:!1}))});function M(e){let{reduced:t=!1}=e,r=(0,i.useRef)(null),o=(0,i.useRef)(null),c=(0,i.useRef)(null);(0,n.D)(e=>{let a=e.clock.elapsedTime;r.current&&(r.current.rotation.y=s.cj9.lerp(r.current.rotation.y,.6*e.pointer.x,.04),r.current.rotation.x=s.cj9.lerp(r.current.rotation.x,-(.3*e.pointer.y),.04),r.current.position.y=.08*Math.sin(.6*a)),o.current&&(o.current.rotation.x=.25*a,o.current.rotation.y=.4*a),c.current&&!t&&(c.current.rotation.z=.15*a)});let m=(0,i.useMemo)(()=>[{pos:[0,1.25,0],scale:.13},{pos:[0,-1.25,0],scale:.13},{pos:[-1.55,0,0],scale:.18},{pos:[1.55,0,0],scale:.18},{pos:[0,0,0],scale:.28}],[]);return(0,a.jsx)(l,{speed:t?.5:1.1,rotationIntensity:t?.1:.35,floatIntensity:t?.1:.3,children:(0,a.jsxs)("group",{ref:r,scale:t?.6:.75,children:[(0,a.jsxs)("group",{ref:c,rotation:[0,0,0],children:[(0,a.jsxs)("mesh",{children:[(0,a.jsx)("torusGeometry",{args:[1.7,.045,24,128]}),(0,a.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.18,emissive:"#7a5a10",emissiveIntensity:.4})]}),(0,a.jsxs)("mesh",{children:[(0,a.jsx)("torusGeometry",{args:[1.78,.012,16,128]}),(0,a.jsx)("meshStandardMaterial",{color:"#F5C238",emissive:"#F5C238",emissiveIntensity:1.2,transparent:!0,opacity:.6})]})]}),(0,a.jsxs)("mesh",{children:[(0,a.jsx)("cylinderGeometry",{args:[.04,.04,2.5,16]}),(0,a.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.9,roughness:.2,emissive:"#5a4008",emissiveIntensity:.4})]}),(0,a.jsxs)("mesh",{rotation:[0,0,Math.PI/2],children:[(0,a.jsx)("cylinderGeometry",{args:[.04,.04,3.1,16]}),(0,a.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.9,roughness:.2,emissive:"#5a4008",emissiveIntensity:.4})]}),(0,a.jsxs)("mesh",{position:[-1.55,0,0],rotation:[Math.PI/2,0,0],children:[(0,a.jsx)("torusGeometry",{args:[.18,.035,16,48]}),(0,a.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.2,emissive:"#5a4008",emissiveIntensity:.5})]}),(0,a.jsxs)("mesh",{position:[1.55,0,0],rotation:[Math.PI/2,0,0],children:[(0,a.jsx)("torusGeometry",{args:[.18,.035,16,48]}),(0,a.jsx)("meshStandardMaterial",{color:"#E5B028",metalness:.95,roughness:.2,emissive:"#5a4008",emissiveIntensity:.5})]}),m.map((e,t)=>(0,a.jsxs)("mesh",{position:e.pos,children:[(0,a.jsx)("sphereGeometry",{args:[e.scale,32,32]}),(0,a.jsx)("meshStandardMaterial",{color:"#F5C238",metalness:.6,roughness:.2,emissive:"#F5C238",emissiveIntensity:.7})]},t)),(0,a.jsxs)("mesh",{ref:o,position:[0,0,-.05],children:[(0,a.jsx)("icosahedronGeometry",{args:[.55,t?1:3]}),(0,a.jsx)(d,{color:"#F7E3A0",thickness:.35,roughness:.15,transmission:.85,ior:1.3,chromaticAberration:.04,backside:!0})]})]})})}function C(e){let{reduced:t=!1}=e;return(0,a.jsx)("div",{className:"absolute inset-0 pointer-events-none","aria-hidden":"true",children:(0,a.jsxs)(o.Hl,{camera:{position:[0,0,8.5],fov:38},dpr:t?1:[1,2],performance:{min:.5},gl:{antialias:!t,alpha:!0,powerPreference:"high-performance"},children:[(0,a.jsx)("ambientLight",{intensity:.55}),(0,a.jsx)("directionalLight",{position:[3,4,5],intensity:1.6,color:"#FFE9B0"}),(0,a.jsx)("pointLight",{position:[-4,-2,3],intensity:1.2,color:"#4A85F6"}),(0,a.jsx)("pointLight",{position:[4,3,-2],intensity:.9,color:"#F5C238"}),(0,a.jsxs)(i.Suspense,{fallback:null,children:[(0,a.jsx)(M,{reduced:t}),!t&&(0,a.jsx)(S,{count:70,scale:[8,5,4],size:2.4,speed:.3,color:"#F5C238",opacity:.9})]})]})})}}}]);