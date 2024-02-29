#version 400

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
out vec4 FragColor;

vec2 curve(vec2 uv){

	uv = (uv - 0.5) * 2.0;

	uv *= 1.0;	// ~1.0

	uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0); 
	uv.y *= 1.0 + pow((abs(uv.x) / 5.0), 2.0);
	uv  = (uv / 2.0) + 0.5;
	uv =  uv *0.92 + 0.04;
	return uv;
}


void main(){

    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor;

    vec2 q = fragCoord.xy / u_resolution.xy;
    vec2 uv = q;
    uv = curve(uv);
    vec3 oricol = texture(u_tex0, vec2(q.x,q.y)).xyz;
    vec3 col;

    float sin_temp1 = sin(0.1 * u_time + uv.y * 21.0);
    float sin_temp2 = sin(0.7 * u_time + uv.y * 29.0);
    float sin_temp3 = sin(0.3 + 0.33 * u_time + uv.y * 31.0);

    float x = sin_temp1 * sin_temp2 * sin_temp3 * 0.002;

    col.r = texture(u_tex0, vec2(x + uv.x + 0.001, uv.y + 0.001)).x + 0.05;
    col.g = texture(u_tex0, vec2(x + uv.x + 0.000, uv.y - 0.002)).y + 0.05;
    col.b = texture(u_tex0, vec2(x + uv.x - 0.002, uv.y + 0.000)).z + 0.05;

    col.r += 0.05 * texture(u_tex0, 0.75 * vec2(x + 0.025, -0.027) + vec2(uv.x + 0.001, uv.y + 0.001)).x;
    col.g += 0.05 * texture(u_tex0, 0.75 * vec2(x + -0.022, -0.02) + vec2(uv.x + 0.000, uv.y - 0.002)).y;
    col.b += 0.05 * texture(u_tex0, 0.75 * vec2(x + -0.02, -0.018) + vec2(uv.x - 0.002, uv.y + 0.000)).z;

    col = clamp(col * 0.4 + 0.4 * col * col * 1.0, 0.0, 1.0);

    float vig = (0.0 + 2.0 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y));
	col *= vec3(pow(vig, 0.3));


    col *= vec3(0.95, 1.05, 0.95);
	//col = mix(col, col * col, 0.3) * 3.8; Both works tbh
    col *= 3.4;

	float scanlines = clamp(0.35 + 0.20 * sin(3.5 * u_time + uv.y * u_resolution.y * 1.5), 0.0, 1.0);
	
	float s = pow(scanlines, 2.0);
	col = col * vec3(0.4 + 0.7 * s) ;

    col *= 1.0 + 0.01 * sin(200.0 * u_time);
	if(uv.x < 0.0 || uv.x > 1.0)
		col *= 0.0;
	if(uv.y < 0.0 || uv.y > 1.0)
		col *= 0.0;
	
	col *= 1.0 - 0.65 * vec3(clamp((mod(fragCoord.x, 2.0) -1.0) * 2.0, 0.0, 1.0));
	
    float comp = smoothstep(0.1, 0.9, sin(u_time));

    fragColor = vec4(col, 2.0);
    FragColor = fragColor;
}