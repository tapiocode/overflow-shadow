/**
 * Copyright (c) 2023 tapiocode
 * https://github.com/tapiocode
 * MIT License
 */

(function() {

  const SCRIPT_NAME = 'overflow-shadow';
  const TAG_SELECTOR = `[${SCRIPT_NAME}]`;
  const WRAPPER_NAME = `${SCRIPT_NAME}-content-wrapper`;
  const getEdgeName = (edge) => `${SCRIPT_NAME}-${edge}`;

  function wrapElems(wrapper, elem) {
    const elems = elem.childNodes;
    while (elems.length) {
      wrapper.appendChild(elems[0]);
    }
    elem.appendChild(wrapper);
  }

  function getEdgeElem(edge) {
    const elem = document.createElement('div');
    elem.innerHTML = `<!-- ${SCRIPT_NAME} observable element for ${edge} -->`;
    return elem;
  }

  function setupIntersectObserver(root) {
    ['top', 'bottom'].forEach((edge) => {
      const edgeElem = getEdgeElem(edge);
      root[edge === 'top' ? 'prepend' : 'append'](edgeElem);

      const options = {
        root,
        rootMargin: '10px',
        threshold: 1.0,
      };
      const callback = (entries) => {
        entries.forEach((entry) => {
          root.parentNode.classList[entry.isIntersecting ? 'remove' : 'add'](getEdgeName(edge));
        });
      };
      const observer = new IntersectionObserver(callback, options);
      observer.observe(edgeElem);
    });
  }

  function initializeElems() {
    const elems = document.querySelectorAll(TAG_SELECTOR);
    elems.forEach((elem) => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute(WRAPPER_NAME, '');
      wrapElems(wrapper, elem);
      setupIntersectObserver(wrapper);
    });
  }

  function injectCss() {
    const css = document.createElement('style');
    const styles = `
      ${TAG_SELECTOR} {
        position: relative;
        height: 100%;
      }
      ${TAG_SELECTOR}:before,
      ${TAG_SELECTOR}:after {
        background: linear-gradient(180deg, rgba(29,29,31,0.5) 0%, rgba(29,29,31,0.15) 35%, rgba(29,29,31,0) 100%);
        opacity: 0;
        transition: opacity .2s ease-in-out;
        content: '';
        display: block;
        height: 1.4rem;
        position: absolute;
        width: 100%;
      }
      ${TAG_SELECTOR}:after {
        background: linear-gradient(0deg, rgba(29,29,31,0.5) 0%, rgba(29,29,31,0.15) 35%, rgba(29,29,31,0) 100%);
        bottom: 0;
      }
      ${TAG_SELECTOR}.${getEdgeName('top')}:before,
      ${TAG_SELECTOR}.${getEdgeName('bottom')}:after {
        opacity: 1;
      }
      [${WRAPPER_NAME}] {
        overflow-y: auto;
        height: 100%;
      }
    `;
    css.appendChild(document.createTextNode(styles));
    document.head.appendChild(css);
  }

  initializeElems();
  injectCss();

})();
