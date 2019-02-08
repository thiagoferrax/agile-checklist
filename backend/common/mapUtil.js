
const array2map = (array, keyField) => array.reduce((map, element) => {
        map[element[keyField]] = element
        return map
    }, {})

module.exports = {array2map}    