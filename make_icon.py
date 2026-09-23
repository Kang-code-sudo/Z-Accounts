import zlib, struct, math, io, os

SS = 2
N = 1024 * SS
R_CORNER = int(N * 0.19)

BG_TOP = (44, 47, 56)
BG_BOT = (26, 28, 34)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def clamp01(v):
    return 0.0 if v < 0 else 1.0 if v > 1 else v

def inside_rounded(x, y, n, r):
    if x < 0 or y < 0 or x >= n or y >= n:
        return False
    cx = min(max(x, r), n - r)
    cy = min(max(y, r), n - r)
    dx, dy = x - cx, y - cy
    return dx * dx + dy * dy <= r * r

def poly_contains(pts, px, py):
    inside = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]; xj, yj = pts[j]
        if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside

pixels = [[None] * N for _ in range(N)]

for y in range(N):
    t = y / N
    base = lerp(BG_TOP, BG_BOT, t ** 1.15)
    if t < 0.12:
        base = lerp((58, 62, 74), base, t / 0.12)
    for x in range(N):
        if inside_rounded(x, y, N, R_CORNER):
            pixels[y][x] = base

u = N / 2048.0

def put_poly(pts, color_fn):
    """color_fn(x, y) -> (r,g,b)，支持笔画内渐变"""
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, x1 = max(0, int(min(xs))), min(N, int(max(xs)) + 1)
    y0, y1 = max(0, int(min(ys))), min(N, int(max(ys)) + 1)
    for y in range(y0, y1):
        for x in range(x0, x1):
            if poly_contains(pts, x, y):
                pixels[y][x] = color_fn(x, y)

border = 58 * u
BORDER_C = (244, 192, 104)
def inner_rounded(x, y):
    b = border
    n2 = N - 2 * b
    r2 = max(1, R_CORNER - b)
    xx, yy = x - b, y - b
    if xx < 0 or yy < 0 or xx >= n2 or yy >= n2:
        return False
    cx = min(max(xx, r2), n2 - r2)
    cy = min(max(yy, r2), n2 - r2)
    dx, dy = xx - cx, yy - cy
    return dx * dx + dy * dy <= r2 * r2
for y in range(N):
    for x in range(N):
        if pixels[y][x] is not None and not inner_rounded(x, y):
            bg = pixels[y][x]
            xx = min(x, N - x); yy = min(y, N - y)
            edge_t = clamp01(1 - (min(xx, yy) / (border * 0.8)))
            c = lerp(BORDER_C, (255, 219, 150), edge_t * 0.5)
            pixels[y][x] = lerp(bg, c, 0.92)

bar_h = 340 * u
y_c = 620 * u
x_l, x_r, tip_x = 400 * u, 1330 * u, 1690 * u
def top_color(x, y):
    t = clamp01((x - x_l) / (tip_x - x_l))
    return lerp((228, 152, 54), (255, 216, 134), t)
put_poly([
    (x_l, y_c - bar_h/2), (x_r, y_c - bar_h/2),
    (x_r, y_c - bar_h*1.32), (tip_x, y_c),
    (x_r, y_c + bar_h*1.32), (x_r, y_c + bar_h/2),
    (x_l, y_c + bar_h/2)], top_color)

y_c2 = 1440 * u
x_l2, x_r2, tip_x2 = 700 * u, 1660 * u, 360 * u
def bot_color(x, y):
    t = clamp01((x_r2 - x) / (x_r2 - tip_x2))
    return lerp((96, 201, 111), (162, 243, 174), t)
put_poly([
    (x_r2, y_c2 - bar_h/2), (x_l2, y_c2 - bar_h/2),
    (x_l2, y_c2 - bar_h*1.32), (tip_x2, y_c2),
    (x_l2, y_c2 + bar_h*1.32), (x_l2, y_c2 + bar_h/2),
    (x_r2, y_c2 + bar_h/2)], bot_color)

w = 250 * u
ax, ay = 1470 * u, 840 * u
bx, by = 590 * u, 1230 * u
L = math.hypot(bx - ax, by - ay)
nx, ny = -(by - ay) / L * w / 2, (bx - ax) / L * w / 2
def diag_color(x, y):
    t = clamp01(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / (L * L))
    return lerp((247, 197, 109), (150, 232, 163), t)
put_poly([
    (ax + nx, ay + ny), (bx + nx, by + ny),
    (bx - nx, by - ny), (ax - nx, ay - ny)], diag_color)

out_n = N // SS
rows = []
for y4 in range(out_n):
    row = bytearray([0])
    for x4 in range(out_n):
        r = g = b = cnt = 0
        for dyy in range(SS):
            for dxx in range(SS):
                c = pixels[y4 * SS + dyy][x4 * SS + dxx]
                if c is not None:
                    r += c[0]; g += c[1]; b += c[2]; cnt += 1
        row += bytes([r // cnt, g // cnt, b // cnt, 255]) if cnt else bytes([0, 0, 0, 0])
    rows.append(bytes(row))

def chunk(tag, data):
    c = struct.pack(">I", len(data)) + tag + data
    return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

ihdr = struct.pack(">IIBBBBB", out_n, out_n, 8, 6, 0, 0, 0)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b"")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icon-src-1024.png")
with io.open(out, "wb") as f:
    f.write(png)
print("written", out, len(png), "bytes")
