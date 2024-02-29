#version 150

#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
out vec4 FragColor;

vec2 curveEffect(vec2 uv){

	uv = (uv - 0.5) * 2.0;
	uv *= 1.0;	// Change this if you want to config distance
	uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0); 
	uv.y *= 1.0 + pow((abs(uv.x) / 5.0), 2.0);
	uv  = (uv / 2.0) + 0.5;
	uv =  uv * 0.92 + 0.04;
	return uv;
}

void main(){

    vec2 fragCoord = gl_FragCoord.xy;
    vec4 finalColor;

    vec2 uv = curveEffect(fragCoord.xy / u_resolution.xy);
    vec3 color;

    float sinComponent1 = sin(0.3 * u_time + uv.y * 21.0);
    float sinComponent2 = sin(0.7 * u_time + uv.y * 29.0);
    float sinComponent3 = sin(0.3 + 0.33 * u_time + uv.y * 31.0);

    float x = sinComponent1 * sinComponent2 * sinComponent3 * 0.002;

    color.r = texture(u_tex0, vec2(x + uv.x + 0.001, uv.y + 0.001)).x + 0.05;
    color.g = texture(u_tex0, vec2(x + uv.x + 0.000, uv.y - 0.002)).y + 0.05;
    color.b = texture(u_tex0, vec2(x + uv.x - 0.002, uv.y + 0.000)).z + 0.05;

    color.r += 0.08 * texture(u_tex0, 0.75 * vec2(x + 0.025, -0.027) + vec2(uv.x + 0.001, uv.y + 0.001)).x;
    color.g += 0.05 * texture(u_tex0, 0.75 * vec2(x + -0.022, -0.02) + vec2(uv.x + 0.000, uv.y - 0.002)).y;
    color.b += 0.08 * texture(u_tex0, 0.75 * vec2(x + -0.02, -0.018) + vec2(uv.x - 0.002, uv.y + 0.000)).z;

    color = clamp(color * 0.6 + 0.4 * color * color * 1.0, 0.0, 1.0);

    float vignette = (1.0 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y));
	color *= vec3(pow(vignette, 0.3));


    color *= vec3(0.95, 1.05, 0.95);
	color = mix(color, color * color, 0.3) * 3.8;

	float scanlineEffect = clamp(0.35 + 0.20 * sin(3.5 * u_time + uv.y * u_resolution.y * 1.5), 0.0, 1.0);
	
	float scanlinePower = pow(scanlineEffect, 1.7);
	color = color * vec3(0.4 + 0.7 * scanlinePower) ;

    color *= 1.0 + 0.01 * sin(200.0 * u_time);

	if(uv.x < 0.0 || uv.x > 1.0){
        color *= 0.0;
    }
		
	if(uv.y < 0.0 || uv.y > 1.0){
        color *= 0.0;
    }
		
	color *= 1.0 - 0.65 * vec3(clamp((mod(fragCoord.x, 2.0) -1.0) * 2.0, 0.0, 1.0));

    finalColor = vec4(color, 2.0);
    FragColor = finalColor;
}