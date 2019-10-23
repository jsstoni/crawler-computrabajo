const url = 'https://www.computrabajo.cl/ofertas-de-trabajo/?q='
const urlBase = 'https://www.computrabajo.cl'

module.exports = ({request, cheerio }) => (req, res) => {
    let id = req.params.id
    let computrabajo = url + id
    request(computrabajo)
    .then(cheerio.load)
    .then($ => {
        //obtener los enlaces de paginacion
        const nr = $("div.breadtitle_mvl > h1 > span").text(), //numero de resultados
        ele = $("[data-id]").length, //numero de elementos
        result = Math.ceil(parseInt(nr) / ele) //resultado de paginas
        let urlspage = `https://www.computrabajo.cl/ofertas-de-trabajo/?p={i}&q=${id}`
        return Array.from(Array(result), (v, i) => urlspage.replace('{i}', i + 1))
    }).then(urls => Promise.all(urls.map(x => request(x))))
    .then(bodies => bodies.map(x => cheerio.load(x)))
    .then(obj => obj.map($ => ($("[data-id]").find('h2.tO').find('a').map((i, x) => urlBase + x.attribs.href).get())))
    .then(result => res.send(result))
}