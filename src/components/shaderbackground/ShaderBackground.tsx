import { useEffect, useRef, useCallback } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_glow_intensity;
  uniform float u_fade_offset;

  vec3 getLight(vec2 p, vec2 mouse) {
    vec2 dir = p - mouse;
    dir.y -= u_fade_offset;
    
    float rad = 28.0 * 3.14159 / 180.0;
    float s = sin(rad); 
    float c = cos(rad);
    
    vec2 tubeDir = vec2(
        dir.x * c + dir.y * s,     
       -dir.x * s + dir.y * c      
    );
    
    float stretch = 1.0;
    if (tubeDir.y < 0.0) {
        stretch = 3.5; 
    } else {
        stretch = 0.7; 
    }
    
    vec2 rocketDir = vec2(tubeDir.x * 2.5, tubeDir.y / stretch);
    float dist = length(rocketDir);
    
    // Warm Amber & Molten Orange Core
    vec3 color = vec3(0.96, 0.52, 0.12);
    
    // Dynamic warm golden wave push effect
    float absoluteY = p.x * c + p.y * s;
    float phase = absoluteY * 7.5 - u_time * 0.06; 
    float colorPush = sin(phase * 6.28318 + dir.y * 10.0) * 0.22;
    
    // Brilliant Champagne Gold / Warm Silver highlight wave
    float chromeFactor = smoothstep(0.3 + colorPush, -1.2 + colorPush, dir.x);
    color = mix(color, vec3(1.0, 0.88, 0.65), chromeFactor * 0.75);
    
    // Deep Amber-Bronze / Charcoal-Orange shadow wave
    float shadowFactor = smoothstep(-0.3 + colorPush, 1.2 + colorPush, dir.x);
    color = mix(color, vec3(0.45, 0.18, 0.05), shadowFactor * 0.65);
    
    // Inner luminescence
    color = mix(color, vec3(0.98, 0.68, 0.28), exp(-dist * 2.2));

    // Smooth organic pulse
    float flow = sin(tubeDir.y * 2.8 - u_time * 1.4) * 0.5 + 0.5;
    float tailMask = smoothstep(0.0, -1.0, tubeDir.y); 
    float pulse = mix(1.0, 0.75 + flow * 0.45, tailMask);

    float falloff = mix(5.5, 1.2, min(u_glow_intensity, 1.0)); 
    float intensity = mix(0.5, 2.6, min(u_glow_intensity, 1.0)) * u_glow_intensity;
    
    float glow = exp(-dist * falloff) * intensity * pulse;
    
    // Deep warm obsidian dark background
    vec3 ambient = vec3(0.04, 0.025, 0.02); 
    
    return ambient + color * glow;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
    mouse.x *= u_resolution.x / u_resolution.y;

    vec3 col = getLight(p, mouse);

    // Subtle vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.45;
    col *= max(vignette, 0.35);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const mouseRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
  });
  const smoothMouseRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
  });
  const startTimeRef = useRef(0);
  const currentGlowRef = useRef(0.35); // Start with gentle ambient glow
  const lastMousePosRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
  });
  const fadeOffsetRef = useRef(0.0);

  const createShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    },
    []
  );

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null;
    try {
      gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    if (!gl) return;
    glRef.current = gl;

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    programRef.current = program;
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    if (posAttr !== -1) {
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    }
  }, [createShader]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    startTimeRef.current = Date.now();
    initGL();

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (glRef.current) {
        glRef.current.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      const gl = glRef.current;
      const program = programRef.current;
      const canvas = canvasRef.current;

      if (!gl || !program || !canvas) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      smoothMouseRef.current.x +=
        (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
      smoothMouseRef.current.y +=
        (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;

      const dx = smoothMouseRef.current.x - lastMousePosRef.current.x;
      const dy = smoothMouseRef.current.y - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      let targetIntensity = 0.25;
      if (speed > 0.1) {
        targetIntensity = Math.min(0.3 + speed * 0.04, 1.4);
      }

      const fadeSpeed =
        targetIntensity > currentGlowRef.current ? 0.18 : 0.02;
      currentGlowRef.current +=
        (targetIntensity - currentGlowRef.current) * fadeSpeed;

      if (speed <= 0.1 && currentGlowRef.current > 0.01) {
        fadeOffsetRef.current += (0.4 - fadeOffsetRef.current) * 0.003;
      } else if (speed > 0.1) {
        fadeOffsetRef.current += (0.0 - fadeOffsetRef.current) * 0.15;
      }

      lastMousePosRef.current.x = smoothMouseRef.current.x;
      lastMousePosRef.current.y = smoothMouseRef.current.y;

      const time = (Date.now() - startTimeRef.current) / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.useProgram(program);

      const uRes = gl.getUniformLocation(program, "u_resolution");
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

      const uMouse = gl.getUniformLocation(program, "u_mouse");
      if (uMouse) {
        gl.uniform2f(
          uMouse,
          smoothMouseRef.current.x * dpr,
          (window.innerHeight - smoothMouseRef.current.y) * dpr
        );
      }

      const uTime = gl.getUniformLocation(program, "u_time");
      if (uTime) gl.uniform1f(uTime, time);

      const uGlow = gl.getUniformLocation(program, "u_glow_intensity");
      if (uGlow) gl.uniform1f(uGlow, currentGlowRef.current);

      const uFade = gl.getUniformLocation(program, "u_fade_offset");
      if (uFade) gl.uniform1f(uFade, fadeOffsetRef.current);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [initGL]);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #1e130c 0%, #0d0907 60%, #050403 100%)",
        }}
      />
    </div>
  );
}
