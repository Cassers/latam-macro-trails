let tip;

function ensure() {
    if (!tip) {
        tip = document.createElement('div');
        tip.className = 'tooltip';
        tip.style.opacity = '0';
        document.body.appendChild(tip);
    }
    return tip;
}

export function showTip(html, event) {
    const t = ensure();
    t.style.opacity = '1';
    t.innerHTML = html;
    t.style.left = (event.pageX + 15) + 'px';
    t.style.top = (event.pageY - 20) + 'px';
}

export function moveTip(event) {
    const t = ensure();
    t.style.left = (event.pageX + 15) + 'px';
    t.style.top = (event.pageY - 20) + 'px';
}

export function hideTip() {
    if (tip) tip.style.opacity = '0';
}
