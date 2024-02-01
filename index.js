'use strict';
String.prototype.clr = function(hexColor) {
    return `<font color='#${hexColor}'>${this}</font>`;
};

const fs = require('fs');
const path = require('path');
const folderName = '=PlayerLogger=';
const directoryPath = path.join(__dirname, '..', '..', '=PlayerLogger=');

// Получаем текущую дату и время
const currentDate = new Date();
const formattedDate = currentDate.toISOString().replace(/:/g, '-').slice(0, 19);
// Создаем имя файла, включающее дату и время
const fileName = `file_${formattedDate}.log`;

// Получаем полный путь к файлу
const filePath = path.join(__dirname, '..', '..', '=PlayerLogger=', 'player-logger');

fs.mkdir(directoryPath, (err) => {
    if (err) {
        // console.error(`Не удалось создать папку: ${err} так как она существует, игнорируем эту ошибку.`);
    } else {
        console.log(`Папка "${folderName}" успешно создана в ${directoryPath}`);
    }
});

module.exports = function PlayerLogger(mod) {

    let isEnabled = true;

    // PatchVersion

    function getDefVersion() {
        let ver = 18
        switch (mod.majorPatchVersion) {
            case 31:
                ver = 14; // Classic
                break;
            case 92:
                ver = 15;
                break;
            case 100:
                ver = 16;
                break;
            default:
                ver = '*'
        }
        return ver
    }


    let file = path.join(__dirname, '..', '..', '=Playerlogger=', 'player-logger' + `${formattedDate}` + '.log');
    let enabled = true;
    mod.hook('S_SPAWN_USER', getDefVersion(), event => {
        if (event.name) {
            mod.command.message('Рядом с Вами: '.clr('E0FFFF') + (`${event.name} `).clr('FFD700') + (` ${event.level} `).clr('56B4E9') + ("LvL ").clr('56B4E9') + ("Guild:").clr('2E8B57') + (` ${event.guildName} `).clr('228B22') + ("GuildRank:").clr('2E8B57') + (` ${event.guildRank}`).clr('228B22'));
            console.log(`Рядом с Вами Игрок:  ${event.name} - ${event.level} - ${event.guildName}`);
            fs.appendFileSync(file, `Name: ==${event.name}== / ${event.level} LvL / Guild: ${event.guildName} / GuildRank: ${event.guildRank}\n`);
        }

        if (event.gm) {
            let message = 'GM '.clr('FF0000') + (`${event.name} `).clr('800080') + ' Обнаружен!'.clr('FF0000');
            if (event.gmInvisible) message += ' (В Инвизе)';

            // Admin Detection Notification		

            mod.command.message(message);

            let msgObject = {
                message: text,
                type: 42,
                chat: 0,
                channel: 27
            };
            mod.send("S_DUNGEON_EVENT_MESSAGE", 2, msgObject);
            event.gmInvisible = false;
            return true;
        }
    });

    // DISABLE / ENABLE MODULE
    mod.command.add('name', {
        '$default'() {
            isEnabled = !isEnabled;
            mod.command.message('Модуль: ' + (isEnabled ? 'Включен'.clr('56B4E9') : 'Отключен'.clr('FF0000')) + '.');
        }
    });

}