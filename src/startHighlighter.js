import { finder } from "@medv/finder";

/////////////////////////////////////////////////////////////////////////////

if (!isEnabled()) {
  isEnabled(true);
  start();
}

/////////////////////////////////////////////////////////////////////////////

function start() {
  let hoveredEl = null;
  let stopClickListening = null;
  let stopMoveListening = null;
  const frame = createFrame();

  stopMoveListening = on(document, "mousemove", (e) => {
    const el = document.elementFromPoint(e.x, e.y);

    if (el !== hoveredEl) {
      if (stopClickListening) {
        stopClickListening();
      }

      hoveredEl = el;
      stopClickListening = on(hoveredEl, "click", function handleElementClick(
        e
      ) {
        stop();
        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        const selector = finder(target);
        const qs = new URLSearchParams();

        qs.append("name", document.title);
        qs.append("url", window.location.href);
        qs.append("selector", selector);

        const newWutchUrl = `${process.env.WUTCH_URL}/wutches/new?${qs}`;
        window.open(newWutchUrl, "_blank");
      });

      positionFrame(frame, hoveredEl);
    }
  });

  function stop() {
    stopMoveListening();
    isEnabled(false);
    document.body.removeChild(frame);
  }
}

function on(el, event, listener) {
  function off() {
    el.removeEventListener(event, listener);
  }

  el.addEventListener(event, listener);

  return off;
}

function style(el, styles) {
  for (const [key, value] of Object.entries(styles)) {
    el.style[key] = value;
  }
}

function isEnabled() {
  if (arguments.length === 0) {
    return window.wutch_highlighter_enabled;
  } else {
    window.wutch_highlighter_enabled = arguments[0];
  }
}

function positionFrame(frame, el) {
  const rect = el.getBoundingClientRect();

  frame.style.top = px(rect.top);
  frame.style.left = px(rect.left);
  frame.style.width = px(rect.width);
  frame.style.height = px(rect.height);
}

function createFrame() {
  const frame = document.createElement("div");
  style(frame, {
    position: "fixed",
    boxShadow: "0 0 0 2px hsl(188, 100%, 47%)",
    background: "hsla(188, 100%, 47%, .2)",
    pointerEvents: "none",
    transition: "all .15s ease",
    borderRadius: "5px",
    zIndex: "99999999",
  });
  document.body.appendChild(frame);

  return frame;
}

function px(val) {
  return `${val}px`;
}
