import { $ } from "../../core/dom";

export function resizeTable($el, $root, event) {
  let debounceTimer;
  const $resizer = $(event.target);
  const $parent = $resizer.closest("[data-parent]");
  const parentType = $parent.data.parent;
  const coords = $parent.getCoords();
  if (parentType == "row") {
    $resizer.css({ opacity: 1, zIndex: 20, width: "100vw" });

    $el.onmousemove = (e) => {
      const delta = e.pageY - coords.bottom;
      const value = delta + coords.height;
      $parent.css({ height: `${value}px` });
    };
  } else {
    const relCells = $root.findAll(
      `[data-column-parent="${$parent.data.column}"]`
    );
    $resizer.css({ opacity: 1, zIndex: 20, height: "100vh" });
    $el.onmousemove = (e) => {
      clearTimeout(debounceTimer);
      const delta = e.pageX - coords.right;
      const value = delta + coords.width;
      $parent.css({ width: `${value}px` });
      debounceTimer = setTimeout(() => {
        relCells.forEach((col) => $(col).css({ width: `${value}px` }));
      }, 200);
    };
  }

  $el.onmouseup = () => {
    $el.onmousemove = null;
    $el.onmouseup = null;
    parentType == "row"
      ? $resizer.css({ opacity: 0, width: "100%" })
      : $resizer.css({ opacity: 0, height: "100%" });
  };
}
