(async function () {
    const color = document.getElementById('color');
    const colorLink = document.getElementById('color-link');
    const radio = document.getElementsByName('logo');
    const radios = document.getElementById('radio-container');
    const openFile = document.getElementById('open-file');
    const svgs = document.getElementById('svg-container');
    const bodyStyles = document.body.style;

    let previousChoice = 'ksl2';
    let logoIndex = 3;
    let colorValueHex = '#666666';

    const doNotRecolor = ['none', '#ffffff', colorValueHex];

    const recolorSvg = (svg) => {
        const descendants = svg.querySelectorAll('*');
        descendants.forEach((element) => {
            if (element.stroke && !doNotRecolor.includes(element.stroke)) {
                element.stroke = colorValueHex;
            }
            if (element.fill && !doNotRecolor.includes(element.fill)) {
                element.fill = colorValueHex;
            }
            if (element.style.stroke && !doNotRecolor.includes(element.style.stroke)) {
                element.style.stroke = colorValueHex;
            }
            if (element.style.fill && !doNotRecolor.includes(element.style.fill)) {
                element.style.fill = colorValueHex;
            }
        });
    };

    const createSvgDiv = async (file) => await fetch(file)
        .then((response) => {
            return response.text();
        })
        .then((source) => {
            source = source.replace(/<\?xml(.*)\?>/i, '');
            const div = document.createElement('div');
            div.innerHTML = source;
            recolorSvg(div.querySelector('svg'));
            return div;
        });

    await createSvgDiv('slash-k.svg').then((div) => {
        svgs.appendChild(div);
    });

    await createSvgDiv('slash-k-basic-path.svg').then((div) => {
        svgs.appendChild(div);
    });

    openFile.addEventListener('click', async (event) => {
        const fileHandles = await window.showOpenFilePicker(
            {
                types: [
                    {
                        description: 'SVG files',
                        accept: {
                            'text/svg': ['.svg'],
                            'text/svg+xml': ['.svg'],
                        },
                    },
                ],
            },
        );
        if (fileHandles.length === 0) {
            return;
        }

        fileHandles.forEach((handle) => {
            addLogo(handle);
        });
    });

    const addLogo = async (handle) => {
        const file = handle.getFile();
        const source = await file
            .then(
                (file) => file.text()
            )
            .then(
                (source) => source.replace(/<\?xml(.*)\?>/i, '')
            );
        const div = document.createElement('div');
        div.innerHTML = source;
        const svg = div.querySelector('svg');
        svg.id = `ksl${logoIndex}`;
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        recolorSvg(svg);
        logoIndex++;

        svgs.appendChild(div);

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'logo';
        radio.value = svg.id;
        radio.checked = true;
        radio.addEventListener('change', radioChangeHandler);
        radioChangeHandler({ currentTarget: radio })
        radios.appendChild(radio);
    };

    const setColors = (colorValue) => {
        colorValueHex = colorValue;
        bodyStyles.setProperty('--color-logo', colorValue);
        colorLink.innerHTML = colorValue;
        colorLink.href = colorValue;
    };

    const fill = window.location.hash.length > 1 ? window.location.hash : colorValueHex;
    color.value = fill;
    setColors(fill);

    const radioChangeHandler = (event) => {
        document.getElementById(previousChoice).style.display = 'none';
        const choice = event.currentTarget.checked && event.currentTarget.value;
        choice && (document.getElementById(choice).style.display = 'inline-block');
        previousChoice = choice;
    };

    radio.forEach((radio, index) => {
        if (index === 0) {
            radio.checked = true;
            radioChangeHandler({ currentTarget: radio });
        }
        radio.addEventListener('change', radioChangeHandler);
    });

    color.addEventListener('change', (event) => {
        const colorValue = color.value;
        window.location.hash = colorValue;
        setColors(colorValue);
    });
}());
