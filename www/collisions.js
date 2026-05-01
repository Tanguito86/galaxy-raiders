// =====================
// GALAXY RAIDERS - collisions.js
// =====================

function getRect(obj) {
  if (!obj) return { x: 0, y: 0, w: 0, h: 0 };
  return {
    x: obj.x || 0,
    y: obj.y || 0,
    w: (obj.w !== undefined) ? obj.w : (obj.width || 0),
    h: (obj.h !== undefined) ? obj.h : (obj.height || 0)
  };
}

function rectOverlap(a, b) {
  const ra = getRect(a);
  const rb = getRect(b);
  return (
    ra.x < rb.x + rb.w &&
    ra.x + ra.w > rb.x &&
    ra.y < rb.y + rb.h &&
    ra.y + ra.h > rb.y
  );
}
