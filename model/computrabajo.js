const url = 'https://www.computrabajo.cl/ofertas-de-trabajo/?q='
const urlBase = 'https://www.computrabajo.cl'

module.exports = ({request, cheerio }) => (req, res) => {
    let id = req.params.id
    let computrabajo = url + id
    request(computrabajo).then(x => x)
    .then(cheerio.load)
    .then($ => {
        //obtener los enlaces de paginacion
        let nr = $("div.breadtitle_mvl > h1 > span").text() //numero de resultados
        let ele = $("[data-id]").length //numero de elementos
        let result = Math.ceil(parseInt(nr) / ele) //resultado de paginas
        let urls = [] //lista con las urls de paginacion
        for(let i = 1; i <= result; i++) {
            let urlspage = `https://www.computrabajo.cl/ofertas-de-trabajo/?p=${i}&q=${id}`
            urls.push(urlspage)
        }
        return urls
    }).then(async (urls) => {
        //request a lista de url de paginacion
        let obj = [] //lista de objectos de la repuesta request
        for (let i = 0; i < urls.length; i++) {
            let body = await request(urls[i]) //request url
            obj.push(cheerio.load(body))
        }
        return obj
    }).then(obj => {
        let listUrl = [] //lista de url de las publicaciones de computrabajo
        //recorrer todos los objectos almacenados
        for (let i = 0; i < obj.length; i++) {
            let $ = obj[i]
            const results = $("[data-id]").find('h2.tO').find('a')
            //almacenar las url de las ofertas
            let enlaces = results.map((i, x) => urlBase + x.attribs.href).get()
            listUrl.push(enlaces)
        }
        return listUrl
    }).then(url => {
        res.send(url)
    })
}