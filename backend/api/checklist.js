module.exports = app => {
    const save = (req, resp) => {
        resp.send('user save')
    }

    return {save}

}