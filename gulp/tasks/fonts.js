import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    //Ищу файлы шрифтов .otf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*otf`, {})
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>"
        }))
    )
    //Конвертирую в .ttf
    .pipe(fonter({
        formats: ['ttf']
    }))
    //Выгружаю в исходную папку
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
    //Ищу файлы шрифтов .ttf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*ttf`, {})
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>"
        }))
    )
    //Конвертирую в .woff
    .pipe(fonter({
        formats: ['woff']
    }))
    //Выгружаю в папку с результатом
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
    //Ищу файлы шрифтов .ttf
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*ttf`))
    //Ковертирую в .woff2
    .pipe(ttf2woff2())
    //Выгружаю в папку с результатом
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
}

export const fontsStyle = () => {
    //Файл стилей подключения шрифтов
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    //Проверяю существуют ли файлы шрифтов
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            //Проверяю существует ли файл стилей для подключения шрифтов
            if (!fs.existsSync(fontsFile)) {
                //Если файла нет, создаю
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (var i = 0; i < fontsFiles.length; i++) {
                    //Записываю подключение шрифтов в файл стилей
                    let fontsFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontsFileName) {
                        let fontsName = fontsFileName.split('-')[0] ? fontsFileName.split('-')[0] : fontsFileName;
                        let fontsWeight = fontsFileName.split('-')[1] ? fontsFileName.split('-')[1] : fontsFileName;
                        if (fontsWeight.toLowerCase() === 'thin') {
                            fontsWeight = 100;
                        } else if (fontsWeight.toLowerCase() === 'extralight') {
                            fontsWeight = 200;
                        } else if (fontsWeight.toLowerCase() === 'light') {
                            fontsWeight = 300;
                        } else if (fontsWeight.toLowerCase() === 'medium') {
                            fontsWeight = 500;
                        } else if (fontsWeight.toLowerCase() === 'semibold') {
                            fontsWeight = 600;
                        } else if (fontsWeight.toLowerCase() === 'bold') {
                            fontsWeight = 700;
                        } else if (fontsWeight.toLowerCase() === 'extrabold' || fontsWeight.toLowerCase() === 'heavy') {
                            fontsWeight = 800;
                        } else if (fontsWeight.toLowerCase() === 'black') {
                            fontsWeight = 900;
                        } else {
                            fontsWeight = 400;
                        }
                        fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontsName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontsFileName}.woff2")format("woff2"),url("../fonts/${fontsFileName}.woff")format("woff");\n\tfont-weight: ${fontsWeight};\n\tfont-style: normal;\n}\r\n`, cb);
                        newFileOnly = fontsFileName;
                            
                    }
                }                
            } else {
                //Если файл есть, выводим сообщение
                console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!")
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
}