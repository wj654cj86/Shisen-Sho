precision highp float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_hueRotate;

vec3 rgb2hsl(vec3 rgb) {
	float maxVal = max(max(rgb.r, rgb.g), rgb.b);
	float minVal = min(min(rgb.r, rgb.g), rgb.b);
	float h = 0.0, s = 0.0, l = (maxVal + minVal) / 2.0;

	if (maxVal != minVal) {
		float d = maxVal - minVal;
		s = l > 0.5 ? d / (2.0 - maxVal - minVal) : d / (maxVal + minVal);
		if (maxVal == rgb.r) {
			h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6.0 : 0.0);
		} else if (maxVal == rgb.g) {
			h = (rgb.b - rgb.r) / d + 2.0;
		} else {
			h = (rgb.r - rgb.g) / d + 4.0;
		}
		h /= 6.0;
	}
	return vec3(h, s, l);
}

vec3 hsl2rgb(vec3 hsl) {
	float h = hsl.x, s = hsl.y, l = hsl.z;
	float c = (1.0 - abs(2.0 * l - 1.0)) * s;
	float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
	float m = l - c / 2.0;
	vec3 rgb;

	if (h < 1.0 / 6.0) {
		rgb = vec3(c, x, 0.0);
	} else if (h < 2.0 / 6.0) {
		rgb = vec3(x, c, 0.0);
	} else if (h < 3.0 / 6.0) {
		rgb = vec3(0.0, c, x);
	} else if (h < 4.0 / 6.0) {
		rgb = vec3(0.0, x, c);
	} else if (h < 5.0 / 6.0) {
		rgb = vec3(x, 0.0, c);
	} else {
		rgb = vec3(c, 0.0, x);
	}
	return rgb + m;
}

void main() {
	vec2 uv = gl_FragCoord.xy / u_resolution;
	uv.y = 1.0 - uv.y; // 翻转 y 坐标
	vec4 color = texture2D(u_image, uv);

	vec3 hsl = rgb2hsl(color.rgb);
	hsl.x = mod(hsl.x + u_hueRotate / 360.0, 1.0);
	vec3 rgb = hsl2rgb(hsl);

	gl_FragColor = vec4(rgb, color.a);
}