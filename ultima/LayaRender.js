!function() {
    var e = {}, n = Matter.Common, o = Matter.Composite, i = Matter.Bounds, t = Matter.Events, r = (Matter.Grid, 
    Matter.Vector);
    e.create = function(o) {
        var i = {
            controller: e,
            engine: null,
            element: null,
            canvas: null,
            mouse: null,
            frameRequestId: null,
            options: {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: "#fafafa",
                wireframeBackground: "#222222",
                hasBounds: !!o.bounds,
                enabled: !0,
                wireframes: !0,
                showSleeping: !0,
                showDebug: !1,
                showBroadphase: !1,
                showBounds: !1,
                showVelocity: !1,
                showCollisions: !1,
                showSeparations: !1,
                showAxes: !1,
                showPositions: !1,
                showAngleIndicator: !1,
                showIds: !1,
                showShadows: !1,
                showVertexNumbers: !1,
                showConvexHulls: !1,
                showInternalEdges: !1,
                showMousePosition: !1
            }
        }, t = n.extend(i, o);
        return t.mouse = o.mouse, t.engine = o.engine, t.container = t.container || Laya.stage, 
        t.bounds = t.bounds || {
            min: {
                x: 0,
                y: 0
            },
            max: {
                x: t.width,
                y: t.height
            }
        }, t;
    }, e.run = function(n) {
        Laya.timer.frameLoop(1, this, e.world, [ n ]), t.on(n.engine.world, "afterRemove", e.onRemoveSprite);
    }, e.stop = function(n) {
        Laya.timer.clear(this, e.world), t.off(n.engine.world, "afterRemove", e.onRemoveSprite);
    }, e.onRemoveSprite = function(e) {
        var n = e.object.layaSprite;
        n && n.parent && n.parent.removeChild(n);
    }, e.world = function(n) {
        var t, s = n.engine.world, a = (n.renderer, n.container), l = n.options, d = o.allBodies(s), p = o.allConstraints(s), c = [];
        l.wireframes ? e.setBackground(n, l.wireframeBackground) : e.setBackground(n, l.background);
        var u = n.bounds.max.x - n.bounds.min.x, h = n.bounds.max.y - n.bounds.min.y, y = u / n.options.width, g = h / n.options.height;
        if (l.hasBounds) {
            for (t = 0; t < d.length; t++) {
                var v = d[t];
                v.render.sprite.visible = i.overlaps(v.bounds, n.bounds);
            }
            for (t = 0; t < p.length; t++) {
                var f = p[t], w = f.bodyA, x = f.bodyB, b = f.pointA, m = f.pointB;
                w && (b = r.add(w.position, f.pointA)), x && (m = r.add(x.position, f.pointB)), 
                b && m && ((i.contains(n.bounds, b) || i.contains(n.bounds, m)) && c.push(f));
            }
            a.scale(1 / y, 1 / g), a.pos(-n.bounds.min.x * (1 / y), -n.bounds.min.y * (1 / g));
        } else c = p;
        for (t = 0; t < d.length; t++) e.body(n, d[t]);
        for (t = 0; t < c.length; t++) e.constraint(n, c[t]);
    }, e.setBackground = function(e, n) {
        if (e.currentBackground !== n) {
            var o = n.indexOf && -1 !== n.indexOf("#");
            e.container.graphics.clear(), o ? e.container.bgColor = n : (e.container.loadImage(n), 
            e.container.bgColor = "#FFFFFF"), e.currentBackground = n;
        }
    }, e.body = function(e, n) {
        e.engine;
        var o = n.render;
        if (o.visible) if (o.sprite && o.sprite.texture) {
            n.id;
            var i = n.layaSprite, t = e.container;
            i || (i = n.layaSprite = s(e, n)), t.contains(i) || t.addChild(i), i.x = n.position.x, 
            i.y = n.position.y, i.rotation = 180 * n.angle / Math.PI, i.scaleX = o.sprite.xScale || 1, 
            i.scaleY = o.sprite.yScale || 1;
        } else {
            n.id;
            var i = n.layaSprite, t = e.container;
            i || ((i = n.layaSprite = a(e, n)).initialAngle = n.angle), t.contains(i) || t.addChild(i), 
            i.x = n.position.x, i.y = n.position.y, i.rotation = 180 * (n.angle - i.initialAngle) / Math.PI;
        }
    };
    var s = function(e, n) {
        var o = n.render.sprite.texture, i = new Laya.Sprite();
        return i.loadImage(o), i.pivotX = n.render.sprite.xOffset, i.pivotY = n.render.sprite.yOffset, 
        i;
    }, a = function(e, n) {
        var o, i, t, r, s = n.render, a = e.options, l = new Laya.Sprite(), d = [], p = l.graphics;
        p.clear();
        for (var c = n.parts.length > 1 ? 1 : 0; c < n.parts.length; c++) {
            r = n.parts[c], a.wireframes ? (o = null, i = "#bbbbbb", t = 1) : (o = s.fillStyle, 
            i = s.strokeStyle, t = s.lineWidth), d.push(r.vertices[0].x - n.position.x, r.vertices[0].y - n.position.y);
            for (var u = 1; u < r.vertices.length; u++) d.push(r.vertices[u].x - n.position.x, r.vertices[u].y - n.position.y);
            d.push(r.vertices[0].x - n.position.x, r.vertices[0].y - n.position.y), p.drawPoly(0, 0, d, o, i, t), 
            (a.showAngleIndicator || a.showAxes) && (t = 1, i = a.wireframes ? "#CD5C5C" : s.strokeStyle, 
            p.drawLine(r.position.x - n.position.x, r.position.y - n.position.y, (r.vertices[0].x + r.vertices[r.vertices.length - 1].x) / 2 - n.position.x, (r.vertices[0].y + r.vertices[r.vertices.length - 1].y) / 2 - n.position.y));
        }
        return l;
    };
    e.constraint = function(e, n) {
        e.engine;
        var o = n.bodyA, i = n.bodyB, t = n.pointA, r = n.pointB, s = e.container, a = n.render, l = (n.id, 
        n.layaSprite);
        l || (l = n.layaSprite = new Laya.Sprite());
        var d = l.graphics;
        if (a.visible && n.pointA && n.pointB) {
            s.contains(l) || s.addChild(l), d.clear();
            var p, c, u, h;
            o ? (p = o.position.x + t.x, c = o.position.y + t.y) : (p = t.x, c = t.y), i ? (u = i.position.x + r.x, 
            h = i.position.y + r.y) : (u = r.x, h = r.y), d.drawLine(p, c, u, h, a.strokeStyle, a.lineWidth);
        } else d.clear();
    }, window.LayaRender = e;
}();