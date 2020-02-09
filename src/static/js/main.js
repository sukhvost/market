function slider() {
    let button = document.querySelectorAll('#js-click');
    let slide = document.querySelector('#js-slide');
    let count = 0;

    for (let i = 0; i < button.length; i++) {
        button[i].onclick = startSlider;

    }

    function startSlider() {
        count += 100;
        slide.style.marginLeft = `-${count}%`;
        if (count == 200) {
            count = -100;
        }
        console.log(count);

    }
    setInterval(startSlider, 5000);
}
slider();